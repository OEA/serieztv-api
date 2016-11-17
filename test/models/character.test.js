/**
 * Created by gbu on 01/11/2016.
 */

import Character from '../../src/Models/Character';
import Star from '../../src/Models/Star';
import bluebird from 'bluebird';
import { expect } from 'chai';
import mongoose from 'mongoose';

mongoose.Promise = bluebird;

describe('Character', ()=> {
    before((done) => {
        Character.remove({}).then(()=> {
            done();
        });
    });
    it('should create and save new character', (done) => {
        Star.findOne({name: 'Emilia Clark'})
            .then((emiliaClark) => {
                const character = new Character({
                    star: emiliaClark._id,
                    characterName: 'Daenerys Targaryen',
                    characterImage: 'image',
                    apiID: '1'
                });
                return Promise.resolve(character);
            })
            .then((character) => {
                character.save((error) => {
                    if (error) done(error);
                    else done();
                });
            });
    });

    it('should check star name and character name', (done) => {
        Character.findOne({characterName: 'Daenerys Targaryen'}).populate('star').exec((error, daenerysTargaryen) => {
            expect(error).to.be.null;
            expect(daenerysTargaryen).not.to.be.null;
            expect(daenerysTargaryen.characterName).to.be.equal('Daenerys Targaryen');
            expect(daenerysTargaryen.star.name).to.be.equal('Emilia Clark');
            done();
        });

    });
});
