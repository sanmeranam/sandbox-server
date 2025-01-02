const schema = require('./schema.json');
const faker = require('faker');
const fs = require('fs');
const _ = require('lodash');

function generate(schema) {
    const data = {};
    for (let key in schema) {
        const { type, properties, size = 1 } = schema[key];
        if (type === 'array') {
            data[key] = [];
            for (let i = 0; i < size; i++) {
                data[key].push(generateData(properties));
            }
        }
    }
    return data;
}

function generateData(_props) {
    const data = {};
    for (let key in _props) {
        const { type, properties } = _props[key];
        if (type === 'object') {
            data[key] = generateData(properties);
        } else {
            data[key] = generateValue(_props[key]);
        }
    }
    return data;
}

function generateValue(properties) {
    const { type, faker: fakerType } = properties;
    if (type === 'string') {
        return _.get(faker, fakerType)();
    } else if (type === 'number') {
        return Math.floor(Math.random() * 9999999);
    } else if (type === 'boolean') {
        return Math.random() > 0.5;
    }
}

const data = generate(schema);
fs.writeFileSync('api/db.json', JSON.stringify(data, null, 2));
console.log('Data generated successfully');