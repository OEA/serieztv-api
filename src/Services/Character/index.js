/**
 * Created by gbu on 21/11/2016.
 */

import mongoose from 'mongoose';
import Character from '../../Models/Character.js';
import Promise from 'bluebird';

Promise.promisifyAll(mongoose);

const CharacterErrorMessages = {
    CHARACTER_ALREADY_EXISTS: "Character already exists",
    CANNOT_CREATE_CHARACTER: "Could not create character",
    CHARACTER_NOT_EXIST: "Character does not exist"
};

class CharacterService {

    static create(character) {
        return new Promise((resolve, reject) => {
            character.save((error) => {
                if (error) {
                    reject(CharacterErrorMessages.CANNOT_CREATE_CHARACTER);
                } else {
                    resolve(character);
                }
            });
        });
    }

    static delete(id) {
        return new Promise((resolve, reject) => {
            Character.find({_id:id}).count((error, count) => {
                if (count == 0 || error) {
                    reject(CharacterErrorMessages.CHARACTER_NOT_EXIST);
                }
            }).then((res) => {
                Character.findOneAndRemove({_id: id}, (error, character) => {
                    if (error) {
                        console.log(error);
                    } else {
                        resolve(character);
                    }
                });
            });

        });
    }

    static searchByName(value) {
        return new Promise((resolve, reject) => {
            Character.find({characterName:value}).count((error, count) => {
                if (count == 0 || error) {
                    reject(CharacterErrorMessages.CHARACTER_NOT_EXIST);
                }
            }).then((count) => {
                Character.find({characterName: value}, (error, characters) => {
                    if (error) {
                        console.log(error);
                    } else {
                        resolve(characters);
                    }
                });
            });

        });
    }

    static findStar(character) {
        return new Promise((resolve, reject) => {
            Character.find({characterName:character.characterName}).count((error, count) => {
                if (count == 0 || error) {
                    reject(CharacterErrorMessages.CHARACTER_NOT_EXIST);
                }
            }).then((count) => {
                Character.findOne({_id: character._id}).populate('star').exec((error, characterStar) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(characterStar.star);
                    }
                });
            });

        });
    }
}

export default CharacterService;