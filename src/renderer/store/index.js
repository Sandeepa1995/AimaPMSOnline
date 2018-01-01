import Vue from 'vue'
import Vuex from 'vuex'
import Paitent from './models/patient'
import User from './models/user'

import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

import dns from 'dns';

import crypto from 'crypto';
import bcrypt from 'bcryptjs';

mongoose.connection.on('error', function(err) {
    console.log('MongoDB event error: ' + err);
});

import modules from './modules'

Vue.use(Vuex);

var vueStore =  new Vuex.Store({
  modules,
  strict: process.env.NODE_ENV !== 'production',
    state:{
        loadedPatients:[],
        conError:false,
        loginPass:null,
        idMatch:false
    },
    mutations:{
        createPatient({commit},payload) {
            var sec=sessionStorage.getItem("secret").split("").reverse().join("");
            if(sec) {
                var patient = new Paitent({
                    name: crypto.createCipher("aes-256-ctr",sec).update(payload.name,"utf-8","hex"),
                    clinic_id: payload.clinic_id,
                    dOB: crypto.createCipher("aes-256-ctr",sec).update(payload.dOB,"utf-8","hex"),
                    clinic_details: crypto.createCipher("aes-256-ctr",sec).update(payload.clinic_details,"utf-8","hex"),
                    diagnosis: crypto.createCipher("aes-256-ctr",sec).update(payload.diagnosis,"utf-8","hex"),
                    investigations: {
                        blood_picture: crypto.createCipher("aes-256-ctr",sec).update(payload.blood_picture,"utf-8","hex"),
                        bone_marrow: crypto.createCipher("aes-256-ctr",sec).update(payload.bone_marrow,"utf-8","hex"),
                        bio_chem: crypto.createCipher("aes-256-ctr",sec).update(payload.bio_chem,"utf-8","hex"),
                    },
                    treatment: crypto.createCipher("aes-256-ctr",sec).update(payload.treatment,"utf-8","hex"),
                    entry_date: crypto.createCipher("aes-256-ctr",sec).update(payload.entry_date,"utf-8","hex"),
                });
                patient.save();
            }
        },
        editPatient({commit},payload) {
            var sec=sessionStorage.getItem("secret").split("").reverse().join("");
            if(sec) {
                // console.log("ads");
                Paitent.findOneAndUpdate({clinic_id:payload.clinic_id},
                {
                    name: crypto.createCipher("aes-256-ctr",sec).update(payload.name,"utf-8","hex"),
                    dOB: crypto.createCipher("aes-256-ctr",sec).update(payload.dOB,"utf-8","hex"),
                    clinic_details: crypto.createCipher("aes-256-ctr",sec).update(payload.clinic_details,"utf-8","hex"),
                    diagnosis: crypto.createCipher("aes-256-ctr",sec).update(payload.diagnosis,"utf-8","hex"),
                    investigations: {
                        blood_picture: crypto.createCipher("aes-256-ctr",sec).update(payload.blood_picture,"utf-8","hex"),
                        bone_marrow: crypto.createCipher("aes-256-ctr",sec).update(payload.bone_marrow,"utf-8","hex"),
                        bio_chem: crypto.createCipher("aes-256-ctr",sec).update(payload.bio_chem,"utf-8","hex"),
                    },
                    treatment: crypto.createCipher("aes-256-ctr",sec).update(payload.treatment,"utf-8","hex"),
                },function(err, doc){
                        if(err){
                            console.log(err);
                        }

                        // console.log(doc);
                    });
            }
        },
        deletePatient({commit},payload) {
            Paitent.findOneAndRemove({clinic_id:payload.clinic_id}, function(err, doc){
                if(err){
                    console.log(err);
                }
            });
        },
        setConError(state){
            state.conError=true;
        },
        setLoginPass(state,payload){
            state.loginPass=payload;
            // console.log(payload);
        },
        setLoadedPatients(state,payload){
            state.loadedPatients=payload;
            // console.log(payload);
        },
        setIDMatch(state,payload){
            state.idMatch=payload;
        }
    },
    actions:{
        connectToDB({commit},payload){
            // Internet
            dns.resolve('www.google.com', function(err) {
                if (err) {
                    console.log("No connection");
                } else {
                    try {
                        mongoose.connect(payload.url,{ useMongoClient: true },
                            function (err) {
                                if (err) {
                                    commit('setConError');
                                    throw err;
                                }
                            });
                    } catch (error) {
                        commit('setConError');
                        console.log(error);
                    }
                    // console.log("Connected");
                    // console.log(sessionStorage.getItem("secret"));
                }
            });
        },

        makeAdmin({commit},payload){
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(payload.pw, salt, function(err, hash) {
                    if(err){
                        throw err;
                    }
                    else {
                        // Store hash in your password DB.
                        var user = new User({
                            username: payload.username,
                            pw: hash,
                            userType: "admin"
                        });
                        user.save();
                    }
                });
            });
        },

        getPass({commit},payload){
            User.findOne({ 'username': payload.username },(err, person)=> {
                if(person){
                    commit('setLoginPass',person.pw);
                }
                // else{
                //     // Need something here
                // }
            });
        },
        loadPatients({commit}){
            Paitent.find({}, function(err, paitents) {
                var ciphered=[];
                var sec=sessionStorage.getItem("secret").split("").reverse().join("");
                paitents.forEach(function(paitent) {
                    var cipPati={
                        name:crypto.createDecipher("aes-256-ctr",sec).update(paitent.name,"hex","utf-8"),
                        clinic_id:paitent.clinic_id,
                        dOB:crypto.createDecipher("aes-256-ctr",sec).update(paitent.dOB,"hex","utf-8"),
                        clinic_details:crypto.createDecipher("aes-256-ctr",sec).update(paitent.clinic_details,"hex","utf-8"),
                        diagnosis:crypto.createDecipher("aes-256-ctr",sec).update(paitent.diagnosis,"hex","utf-8"),
                        blood_picture:crypto.createDecipher("aes-256-ctr",sec).update(paitent.investigations.blood_picture,"hex","utf-8"),
                        bone_marrow:crypto.createDecipher("aes-256-ctr",sec).update(paitent.investigations.bone_marrow,"hex","utf-8"),
                        bio_chem:crypto.createDecipher("aes-256-ctr",sec).update(paitent.investigations.bio_chem,"hex","utf-8"),
                        treatment:crypto.createDecipher("aes-256-ctr",sec).update(paitent.treatment,"hex","utf-8"),
                        entry_date:crypto.createDecipher("aes-256-ctr",sec).update(paitent.entry_date,"hex","utf-8"),
                    };
                    ciphered.push(cipPati);
                });
                commit('setLoadedPatients',ciphered);
            });
        },
        checkPatientInDB({commit},payload){
            Paitent.find({ 'clinic_id': payload.pat_id },(err, person)=> {
                // console.log(person);
                if(person.length>0){
                    commit('setIDMatch',true);
                }
                else{
                    commit('setIDMatch',false);
                }
            });
        },
    },
    getters:{
      conError(state){
          return state.conError;
      },
        loginPass(state){
          return state.loginPass;
        },
        loadedPatients(state){
            return state.loadedPatients;
        },
        matchPatients(state){
            return state.idMatch;
        }
    }
});

export default vueStore
