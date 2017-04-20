'use strict';

module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('User', {
        user_id: {
            type: DataTypes.INTEGER(11),
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        first_name: DataTypes.STRING(45),
        last_name: DataTypes.STRING(45),
        email: {
            type: DataTypes.STRING(45),
            allowNull: false,
            unique: true
        },
        password: DataTypes.STRING(75),
        salt: DataTypes.STRING(40),
        created: DataTypes.DATE,
        created_by: DataTypes.STRING(45),
        modified: DataTypes.DATE,
        modified_by: DataTypes.STRING(45),
        last_login: DataTypes.DATE,
        blocked: DataTypes.INTEGER(1),
        braintree_customer_id: DataTypes.STRING(45)
    }, {
            tableName: 'USERS',
            timestamps: false,
            underscored: true,

            classMethods: {
                associate: function associate(models) {
                    //User.hasMany(models.OAuthClient);
                },
            },
        });

    return User;
};
