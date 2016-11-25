/**
 * Created by gbu on 21/11/2016.
 */
import assert from 'assert';
import mongoose from 'mongoose';
import Character from '../../src/Models/Character';
import Star from '../../src/Models/Star';
import CharacterService from '../../src/Services/Character/index';
import bluebird from 'bluebird';

bluebird.promisifyAll(mongoose);

const star = new Star({
    name: 'Harrison Ford',
    image: 'starImage',
    active: true,
    apiID: '1'
});

describe('CharacterService', ()=> {
    before((done) => {
        Character.remove({}).then(()=> {

            star.save();
            done();
        });
    });

    it('should create new character', (done) => {
        const character = new Character({
            star: star._id,
            characterName: 'Han Solo',
            characterImage: 'characterImage',
            apiID: '1'
        });
        CharacterService.create(character)
            .then((result) => {
                assert.equal(result.characterName, "Han Solo");
                done();
            });
    });

    it('should not create character that has missing argument', (done) => {
        const character = new Character({
            star: star._id,
            characterName: 'Han Solo',
            apiID: '1'
        });
        CharacterService.create(character)
            .then((result) => {

            }).catch((error) => {
                assert.equal(error, "Could not create character");
                done();
        });
    });

    it('should search character by name and return image of character with that name', (done) => {
        const character = new Character({
            star: star._id,
            characterName: 'Indiana Jones',
            characterImage: 'indianaJonesImage',
            apiID: '1'
        });
        CharacterService.create(character)
            .then((res) => {
                CharacterService.searchByName(character.characterName)
                    .then((result) => {
                        assert.equal(result[0].characterImage, 'indianaJonesImage');
                        done();
                    });
            });
    });

    it('should search character by name and return image of second character with that name', (done) => {
        const secondHanSolo = new Character({
            star: star._id,
            characterName: 'Han Solo',
            characterImage: 'secondIndianaJonesImage',
            apiID: '1'
        });
        CharacterService.create(secondHanSolo)
            .then((test) => {
                CharacterService.searchByName('Han Solo')
                    .then((result) => {
                        assert.equal(result[1].characterImage, 'secondIndianaJonesImage');
                        done();
                    });
            });
    });

    it('should search by name and not return for nonexistent character', (done) => {
        const character = new Character({
            star: star._id,
            characterName: 'Harrison Ford',
            characterImage: 'characterImage',
            apiID: '1'
        });
        CharacterService.searchByName(character.characterName)
            .then((result) => {

            }).catch((error) => {
                assert.equal(error, "Character does not exist");
                done();
        });
    });



    it('should find star name of the character', (done) => {
        const character = new Character({
            star: star._id,
            characterName: 'Han Solo',
            characterImage: 'characterImage',
            apiID: '1'
        });
        CharacterService.create(character)
            .then( (created) => {
                CharacterService.findStar(created)
                    .then((starResult) => {
                        console.log('starresult' + starResult);
                        assert.equal(starResult.name, 'Harrison Ford');
                        done();
                    });
            });

    });

    it('should not find star of nonexistent character', (done) => {

        const character = new Character({
            star: star._id,
            characterName: 'Harrison Ford',
            characterImage: 'characterImage',
            apiID: '1'
        });
        CharacterService.findStar(character)
            .then((result) => {

            }).catch((error) => {
            assert.equal(error, "Character does not exist");
            done();
        });
    });

    it('should not delete nonexistent character', (done) => {
        const character = new Character({
            star: star._id,
            characterName: 'Harrison Ford',
            characterImage: 'characterImage',
            apiID: '1'
        });
        CharacterService.delete(character._id)
            .then((result) => {

            }).catch((error) => {
            assert.equal(error, "Character does not exist");
            done();
        });
    });

    it('should delete the character', (done) => {
        const character = new Character({
            star: star._id,
            characterName: 'Jack Ryan',
            characterImage: 'characterImage',
            apiID: '1'
        });
        CharacterService.create(character)
            .then((created) => {
                console.log('created char' + created);
                CharacterService.delete(created._id)
                    .then((result) => {
                        console.log('result char' + result);
                        assert.equal(result.characterName, "Jack Ryan");
                        done();
                    });
            });
    });

});