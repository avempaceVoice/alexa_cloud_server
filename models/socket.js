/**
 * 
 * Copyright (c) 2017, Avempace Wireless (Daghfous Wejd). All rights reserved.
 * 
 */
module.exports = function(sequelize, DataTypes) {
    var socket = sequelize.define("sockets", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            unique: true
        },
        num_serie: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        selected: DataTypes.BOOLEAN,
        socket: DataTypes.TEXT
    }, { timestamps: true });

    return socket;
};