var sqldb = require('../config/sequelize');
var User = sqldb.User;
var Sequelize = require('sequelize');
var OAuthAccessToken = sqldb.OAuthAccessToken;
var OAuthRefreshToken = sqldb.OAuthRefreshToken;
var errorConst = require('../config/error.constant');

module.exports = {
    findAll: findAll,
    findById: findById,
    findOne: findOne,
    createUser: createUser,
    createUserTransactionForDriver: createUserTransactionForDriver,
    modifyUser: modifyUser,
    deleteAccessToken: deleteAccessToken,
    getTableName: getTableName,
    createUserTransaction: createUserTransaction,
    modifyUserTransaction: modifyUserTransaction,
    updateUser: updateUser,
    modifyUserAboutTransaction: modifyUserAboutTransaction
};

function getPublicUser(user) {
    delete user.password;
    return user;
}
function findAll(callback) {
    User
        .findAll({}).then(function (response) {
            for (var i = 0; i < response.length; i++) {
                getPublicUser(response[i]);
            }
            callback(null, response);
        }
        ).catch(function (err) {
            callback(err);
        });
}

function findById(id, callback) {
    User
        .findOne({
            where: { user_id: id }
        })
        .then(function (res) {
            if (res) {
                callback(null, res.dataValues);
            } else {
                callback(null, res);
            }
        }).catch(function (err) {
            callback(err);
        });
}

function findOne(condition, callback) {
    var query = {
        where: condition
    };
    User.findOne(query).then(function (response) {
        callback(null, response);
    }).catch(function (err) {
        callback(err);
    });
}

function createUser(userModel, callback) {
    User
        .create(userModel)
        .then(function (res) {
            callback(null, getPublicUser(res.dataValues));
        }).catch(function (err) {
            callback(err);
        });
}
function createUserTransactionForDriver(userModel, userMetaModel, callback) {
    var user = {};
    var t;
    sqldb.sequelize.transaction(function (_t) {
        t = _t;
        return User
            .create(userModel, { transaction: t })
            .then(createDeviceUuid);
    }).then(function (response) {
        callback(null, getPublicUser(user));
    })
        .catch(function (err) {
            callback(err);
        });

    function createDeviceUuid(_user) {
        user = _user.dataValues;
        userMetaModel.user_id = user.user_id;
        return sqldb.UserMeta.create(userMetaModel, { transaction: t });
    }
}

function modifyUser(userId, userModel, callback) {
    User
        .findOne({
            where: { user_id: userId }
        })
        .then(function (oldUser) {
            if (!oldUser) {
                callback({
                    "message": errorConst.USER.NOT_FOUND,
                    "statusCode": 404
                });
            } else {
                delete userModel.user_id;
                User.update(userModel,
                    { where: { user_id: userId } })
                    .then(function (response) {
                        callback(null);
                    });
            }
        })
        .catch(function (err) {
            callback(err);
        });
}

function updateUser(userId, userModel, callback) {
    delete userModel.user_id;
    User.update(userModel,
        { where: { user_id: userId } })
        .then(function (response) {
            callback(null);
        })
        .catch(function (err) {
            callback(err);
        });
}

function modifyUserTransaction(userId, userModel, roleId, fileModel, fileToEntityModel, userMetaModel, callback) {
    var user = {};
    var file = {};
    var t;
    delete userModel.user_id;
    sqldb.sequelize.transaction(function (_t) {
        t = _t;
        return User
            .update(userModel, { where: { user_id: userId }, transaction: t })
            .then(setRole)
            .then(createFile)
            .then(createFileToEntity)
            .then(createUserMeta);
    }).then(function (response) {
        callback(null, {
            user: user,
            file: file
        });
    }).catch(function (err) {
        callback(err);
    });

    function setRole(_user) {
        user = _user;
        return sqldb.UserRole.create({ user_id: userId, role_id: roleId }, { transaction: t });
    }
    function createFile() {
        return sqldb.File.create(fileModel, { transaction: t });
    }
    function createFileToEntity(_file) {
        file = _file;
        fileToEntityModel.file_id = _file.file_id;
        return sqldb.FileToEntity.create(fileToEntityModel, { transaction: t });
    }
    function createUserMeta() {
        return sqldb.UserMeta.bulkCreate(userMetaModel, { transaction: t });
    }
}

function deleteAccessToken(user_id, callback) {

    OAuthAccessToken.destroy({
        where: { user_id: user_id }
    })
        .then(function (response) {
            OAuthRefreshToken.destroy({
                where: { user_id: user_id }
            })
                .then(function (response) {
                    callback(null);
                })
                .catch(function (err) {
                    callback(err);
                });
        })
        .catch(function (err) {
            callback(err);
        });
}

function getTableName() {
    return User.getTableName();
}

function createUserTransaction(userModel, fileModel, fileToEntityModel, roleId, userMetaModel, callback) {
    var user = {};
    var file = {};
    var t;
    sqldb.sequelize.transaction(function (_t) {
        t = _t;
        if (!fileModel) {
            return User
                .create(userModel, { transaction: t })
                .then(setRole)
                .then(createUserMeta);
        }
        return User
            .create(userModel, { transaction: t })
            .then(setRole)
            .then(createFile)
            .then(createFileToEntity)
            .then(createUserMeta);
    }).then(function (response) {
        callback(null, {
            user: user,
            file: file
        });
    })
        .catch(function (err) {
            callback(err);
        });

    function setRole(_user) {
        user = _user.dataValues;
        return sqldb.UserRole.create({ user_id: user.user_id, role_id: roleId }, { transaction: t });
    }

    function createFile() {
        fileModel.created_by = user.user_id;
        return sqldb.File.create(fileModel, { transaction: t });
    }
    function createFileToEntity(_file) {
        file = _file;
        fileToEntityModel.file_id = _file.file_id;
        fileToEntityModel.entity_id = user.user_id;
        return sqldb.FileToEntity.create(fileToEntityModel, { transaction: t });
    }
    function createUserMeta() {
        userMetaModel[0].user_id = user.user_id;
        return sqldb.UserMeta.bulkCreate(userMetaModel, { transaction: t });
    }

}
function modifyUserAboutTransaction(userId, userModel, userMetaModel, callback) {

    var user = {};
    var file = {};
    var t;
    sqldb.sequelize.transaction(function (_t) {
        t = _t;
        return User
            .update(userModel, { where: { user_id: userId }, transaction: t })
            .then(updateUserMeta);
    }).then(function (response) {
        callback(null, response);
    }).catch(function (err) {
        callback(err);
    });
    function updateUserMeta() {
        return sqldb.UserMeta.update({ meta_value: userMetaModel.meta_value }, {
            where: {
                user_id: userId,
                meta_name_id: userMetaModel.meta_name_id
            }
        }, { transaction: t });
    }

}