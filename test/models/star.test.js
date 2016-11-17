/**
 * Created by gbu on 01/11/2016.
 */

import { expect } from 'chai';
import mongoose from 'mongoose';
import Star from '../../src/Models/Star';
import bluebird from 'bluebird';

mongoose.Promise = bluebird;

const KitHarrington = new Star({
    name: 'Kit Harrington',
    image: 'image',
    active: true,
    apiID: '1'
});

const EmiliaClark = new Star({
    name: 'Emilia Clark',
    image: 'image',
    active: true,
    apiID: '2'
});

const SeanBean = new Star({
    name: 'Sean Bean',
    image: 'image',
    active: true,
    apiID: '3'
});

const MarkHamill = new Star({
    name: 'Mark Hamill',
    image: 'image',
    active: true,
    apiID: '4'
});

describe('Star', ()=> {
    before((done) => {
        Star.remove({}).then(()=> {
            done();
        });
    });

    it('should create and save new stars', (done) => {
        Promise.all([
            KitHarrington.save(),
            EmiliaClark.save(),
            SeanBean.save(),
            MarkHamill.save()
        ]).then(()=>{
            done();
        });
    });

    it('should return created star that is Mark Hamill', (done) => {
        Star.findOne({name: 'Mark Hamill'}).limit(1).exec((error, markHamill)=> {
            expect(markHamill).not.to.be.null;
            expect(markHamill.name).to.be.equal('Mark Hamill');
            done();
        });
    });
});