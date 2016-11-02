/**
 * Created by gbu on 01/11/2016.
 */

import Character from '../../src/Models/Character';
import Star from '../../src/Models/Star';
import bluebird from 'bluebird';
import assert from 'assert';
import mongoose from 'mongoose';

mongoose.Promise = bluebird;

const star = new Star({
    name: 'Daisy Ridley',
    image: 'image',
    active: true,
    apiID: '1'
});



describe('Character', ()=> {
    before((done) => {
        Character.remove({}).then(()=> {
            done();
        });
    });
    star.save();
    it('should create and save new character', (done) => {
        const character = new Character({
            star: star._id,
            characterName: 'Rey',
            characterImage: 'image',
            apiID: '1'
        });
        character.save((error) => {
            if (error) done(error);
            else done();
        });

    });

    it('should return star name of the character', (done) => {
        Character.find({}).populate('star').exec((error, characters) => {
            const character = characters[0];
            console.log("character" + character);
            assert.equal(character.star.name, 'Daisy Ridley');
            done();
        });

    });

    it('should return created character that is Rey', (done) => {
        Character.find({characterName: 'Rey'}).limit(1).exec((error, characters)=> {
            const character = characters[0];
            assert.equal(character.characterName, 'Rey');
            done();
        });
    });
});
