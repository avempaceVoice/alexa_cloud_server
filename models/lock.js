module.exports = function(sequelize, DataTypes) {
    var lock = sequelize.define("locks", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            unique: true
        },
        status : DataTypes.STRING,
        description : DataTypes.STRING
    }, {timestamps: true});

    return lock;
};