/**
 * Created by gbu on 01/11/2016.
 */

import Crew from '../../src/Models/Crew';
import bluebird from 'bluebird';
import { expect } from 'chai';
import mongoose from 'mongoose';

mongoose.Promise = bluebird;
describe('Crew', ()=> {
    before((done) => {
        Crew.remove({}).then(()=> {
            done();
        });
    });

    it('should create and save new crew', (done) => {
        const crew = new Crew({
            name: 'George Lucas',
            image: 'image',
            job: 'Director',
            department: 'Directing',
            apiID: '1'
        });
        crew.save((error) => {
            if (error) done(error);
            else done();
        });

    });

    it('should return created crew that is George Lucas', (done) => {
        Crew.findOne({name: 'George Lucas'}).limit(1).exec((error, georgeLucas)=> {
            expect(georgeLucas).not.to.be.null;
            expect(georgeLucas.name).to.be.equal('George Lucas');
            done();
        });
    });
});


