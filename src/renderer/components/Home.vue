<template>
    <v-layout row wrap justify-center id="wrapper">
        <v-flex xs12 v-if="(!loggedin)||(loading)">
        <v-layout justify-center>
            <h1 style="color: maroon; font-size: 150px; padding: 0px; height: 100px">αἷμα</h1>
        </v-layout>
        </v-flex>
        <v-flex xs12 v-if="(!loggedin)||(loading)">
        <v-layout justify-center>
            <img src="/static/ripple.gif" style="height: 200px;">
        </v-layout>
        </v-flex>
        <!--Initialization dialog sd-->
        <v-dialog v-model="initDialog" persistent max-width="500px" v-if="noInit">
            <!--<v-btn color="primary" dark slot="activator">Open Dialog</v-btn>-->
            <v-card>
                <v-alert v-if="conError||otherError"  color="error" icon="warning" value="true">
                    {{errorMsg}}
                </v-alert>
                <v-card-title>
                    <v-flex xs12>
                    <v-layout xs12 justify-center>
                        <h3 style="color: darkgray;">Welcome to</h3>
                    </v-layout>
                    </v-flex>
                    <v-flex xs12>
                    <v-layout xs12 justify-center>
                        <h1 style="color: maroon; font-size: 50px">αἷμα</h1>
                    </v-layout>
                    </v-flex>
                    <v-flex xs12>
                        <v-layout xs12 justify-center>
                            <h3 style="color: darkgray;">Start off by initializing the system!</h3>
                        </v-layout>
                    </v-flex>
                </v-card-title>
                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-form v-model="validIniti" ref="iniForm" style="width: 100%">
                                <!--MongoURL-->
                                <v-flex xs12>
                                    <v-text-field
                                            label="MongoDB URL"
                                            :rules="textRules"
                                            v-model="iniURL"
                                            required></v-text-field>
                                </v-flex>
                                <hr size="5" style="background-color: maroon">
                                <h3 style="padding-top: 20px"> Admin user details :</h3>
                                <!--Username-->
                                <v-flex xs12>
                                    <v-text-field
                                            label="Username"
                                            :rules="textRules"
                                            v-model="iniName"
                                            required></v-text-field>
                                </v-flex>

                                <!--PW-->
                                <v-flex xs12>
                                    <v-text-field
                                            label="Password"
                                            :rules="pwRules"
                                            v-model="iniPW"
                                            :counter="15"
                                            type="password"
                                            required></v-text-field>
                                </v-flex>

                                <!--Confirm PW-->
                                <v-flex xs12>
                                    <v-text-field
                                            label="Confirm Password"
                                            :rules="[() => !!iniConfPW || 'Please confirm the password entered above',
                                                    () => iniConfPW==iniPW || 'The entered passwords do not match'
                                            ]"
                                            v-model="iniConfPW"
                                            v-bind:counter="iniPW.length"
                                            type="password"
                                            required></v-text-field>
                                </v-flex>

                                <v-card flat>
                                    <v-card-text>
                                        <v-checkbox label="Has this database been used allready?" v-model="iniExisting"></v-checkbox>
                                    </v-card-text>
                                </v-card>

                                <hr size="5" style="background-color: maroon">
                                <h3 style="padding-top: 20px"> Secret :</h3>
                                <p style="color: gray;">This will be shared among those who will access the system as users. *Must be over 10 characters.</p>
                                <p style="color: red;">MAKE SURE THAT IT WILL BE COMPLEX AND ONLY SHARE AMONG THOSE TRUSTWORTHY! THIS CANNOT BE LATER CHANGED!</p>
                                <!--Secret-->
                                <v-flex xs12>
                                    <v-text-field
                                            label="Secret"
                                            :rules="secretRules"
                                            v-model="iniSecret"
                                            type="password"
                                            required></v-text-field>
                                </v-flex>

                                <!--Confirm Secret-->
                                <v-flex xs12>
                                    <v-text-field
                                            label="Confirm Secret"
                                            :rules="[() => !!iniConfSecret || 'Please confirm the secret entered above',
                                                    () => iniConfSecret==iniSecret || 'The entered secrets do not match'
                                            ]"
                                            v-model="iniConfSecret"
                                            v-bind:counter="iniSecret.length"
                                            type="password"
                                            required></v-text-field>
                                </v-flex>

                            </v-form>
                        </v-layout>
                    </v-container>
                    <small>*indicates required field</small>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <!--<v-btn color="blue darken-1" flat @click.native="clearIniti">Clear</v-btn>-->
                    <v-btn color="blue darken-1" flat @click.native="initialize"
                           :disabled="!validIniti"
                    >Get Started!</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!--Login dialog-->
        <v-dialog v-model="loginDialog" persistent max-width="500px" v-if="!loggedin">
            <!--<v-btn color="primary" dark slot="activator">Open Dialog</v-btn>-->
            <v-card>
                <v-alert v-if="loginError"  color="error" icon="warning" value="true">
                    {{loginMsg}}
                </v-alert>
                <v-card-title>
                    <v-flex xs12>
                        <v-layout xs12 justify-center>
                            <h3 style="color: darkgray;">Login to</h3>
                        </v-layout>
                    </v-flex>
                    <v-flex xs12>
                        <v-layout xs12 justify-center>
                            <h1 style="color: maroon; font-size: 50px">αἷμα</h1>
                        </v-layout>
                    </v-flex>
                </v-card-title>
                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-form v-model="validLogin" ref="loginForm" style="width: 100%">
                                <!--Username-->
                                <v-flex xs12>
                                    <v-text-field
                                            label="Username"
                                            :rules="textRules"
                                            v-model="loginUN"
                                            required></v-text-field>
                                </v-flex>

                                <!--PW-->
                                <v-flex xs12>
                                    <v-text-field
                                            label="Password"
                                            :rules="pwRules"
                                            v-model="loginPW"
                                            :counter="15"
                                            type="password"
                                            required></v-text-field>
                                </v-flex>

                                <!--Secret-->
                                <v-flex xs12>
                                    <v-text-field
                                            label="Secret"
                                            :rules="secretRules"
                                            v-model="loginSecret"
                                            type="password"
                                            required></v-text-field>
                                </v-flex>

                            </v-form>
                        </v-layout>
                    </v-container>
                    <small>*indicates required field</small>
                </v-card-text>
                <v-flex xs12 v-if="loadingPW">
                    <v-layout justify-center>
                        <img src="/static/ripple.gif" style="height: 50px;">
                    </v-layout>
                </v-flex>
                <v-card-actions v-if="!loadingPW">
                    <v-spacer></v-spacer>
                    <!--<v-btn color="blue darken-1" flat @click.native="clearIniti">Clear</v-btn>-->
                    <v-btn color="red darken-1" flat @click.native="login"
                           :disabled="!validLogin"
                    >Login</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!--Dialog to add a new patient-->
        <v-flex xs12>
            <v-layout justify-center>
                <v-dialog v-model="addNewDialog" max-width="500px" v-if="(loggedin)&&(!loading)">
                    <v-btn color="success" dark slot="activator">Add new patient</v-btn>
                    <v-card v-if="addNewDialog">
                        <v-card-title>
                            <span class="headline">Add new patient</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container grid-list-md>
                                <v-layout wrap>
                                    <v-form v-model="validNew" ref="newForm" style="width: 100%">
                                    <!--Name-->
                                    <v-flex xs12>
                                        <v-text-field
                                                label="Name"
                                                :rules="textRules"
                                                v-model="newName"
                                                required></v-text-field>
                                    </v-flex>
                                        <v-alert v-if="existingPatient"  color="error" icon="warning" value="true" transition="scale-transition">
                                            <v-layout justify-center>
                                                The clinic number you entered is already in the database.
                                            </v-layout>
                                        </v-alert>

                                    <!--Clinic Number-->
                                    <v-flex xs12>
                                        <v-layout row wrap>
                                            <v-flex xs6>
                                        <v-select
                                                label="Clinic Type"
                                                :rules="textRules"
                                                v-model="newClinType"
                                                required
                                                :items="['P/AC', 'P/SH']"
                                                @change="checkPatientInDB"
                                        ></v-select>
                                            </v-flex>
                                            <v-flex xs6>
                                        <v-text-field
                                                label="Number - Year"
                                                :rules="cNumRules"
                                                v-model="newClinNumber"
                                                @change="checkPatientInDB"
                                                required></v-text-field>
                                            </v-flex>
                                        </v-layout>
                                    </v-flex>

                                    <!--Date of Birth-->
                                    <v-flex xs11>
                                        <v-menu
                                                lazy
                                                :close-on-content-click="false"
                                                v-model="menu"
                                                transition="scale-transition"
                                                offset-y
                                                full-width
                                                :nudge-right="40"
                                                max-width="290px"
                                                min-width="290px"
                                        >
                                            <v-text-field
                                                    slot="activator"
                                                    label="Date of Birth"
                                                    v-model="newDOB"
                                                    :rules="dOBRules"
                                                    prepend-icon="event"
                                                    readonly
                                            ></v-text-field>
                                            <v-date-picker v-model="newDOB" no-title scrollable actions required>
                                                <template slot-scope="{ save, cancel }">
                                                    <v-card-actions>
                                                        <v-spacer></v-spacer>
                                                        <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
                                                        <v-btn flat color="primary" @click="save">OK</v-btn>
                                                    </v-card-actions>
                                                </template>
                                            </v-date-picker>
                                        </v-menu>
                                    </v-flex>

                                    <!--Clinic Details-->
                                    <v-flex xs12>
                                        <v-text-field
                                                label="Clinical Details"
                                                :rules="textRules"
                                                v-model="newClinDetails"
                                                multi-line></v-text-field>
                                    </v-flex>

                                    <!--Diagnosis-->
                                    <v-flex xs12>
                                        <v-text-field
                                                label="Diagnosis"
                                                :rules="textRules"
                                                v-model="newDiagnosis"
                                                multi-line></v-text-field>
                                    </v-flex>

                                    <!--Investigations-->
                                    <v-flex xs12>
                                        <h3>Investigations:</h3>
                                        <!--<v-subheader>Investigations</v-subheader>-->
                                        <v-text-field
                                                label="Blood Picture"
                                                :rules="textRules"
                                                v-model="newBloodPic"></v-text-field>
                                        <v-text-field
                                                label="Bone Marrow"
                                                :rules="textRules"
                                                v-model="newBoneMarrow"></v-text-field>
                                        <v-text-field
                                                label="Bio Chemistry"
                                                :rules="textRules"
                                                v-model="newBioChemistry"></v-text-field>
                                    </v-flex>

                                    <!--Treatment-->
                                    <v-flex xs12>
                                        <v-text-field
                                                label="Treatment"
                                                :rules="textRules"
                                                v-model="newTreatment"
                                                multi-line></v-text-field>
                                    </v-flex>
                                    </v-form>
                                </v-layout>
                            </v-container>
                            <small>*indicates required field</small>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" flat @click.native="clear">Clear</v-btn>
                            <v-btn color="blue darken-1" flat @click.native="addNewDialog = false">Close</v-btn>
                            <v-btn color="blue darken-1" flat @click.native="addNewPatient"
                                   :disabled="(!validNew)||existingPatient"
                            >Save</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-layout>
        </v-flex>

        <!--Edit dialog-->
        <v-flex xs12 v-if="editDialog">
            <v-layout justify-center>
                <v-dialog v-model="editDialog" max-width="500px">
                    <v-card>
                        <v-card-title>
                            <span class="headline">Edit Patient</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container grid-list-md>
                                <v-layout wrap>
                                    <v-form v-model="validEdit" ref="editForm" style="width: 100%">
                                        <!--Name-->
                                        <v-flex xs12>
                                            <v-text-field
                                                    label="Name"
                                                    :rules="textRules"
                                                    v-model="editName"
                                                    required></v-text-field>
                                        </v-flex>

                                        <!--Clinic Number-->
                                        <v-flex xs12>
                                            <p>Clinic ID: {{editID}}</p>
                                        </v-flex>

                                        <!--Date of Birth-->
                                        <v-flex xs11>
                                            <v-menu
                                                    lazy
                                                    :close-on-content-click="false"
                                                    v-model="menu"
                                                    transition="scale-transition"
                                                    offset-y
                                                    full-width
                                                    :nudge-right="40"
                                                    max-width="290px"
                                                    min-width="290px"
                                            >
                                                <v-text-field
                                                        slot="activator"
                                                        label="Date of Birth"
                                                        v-model="editDOB"
                                                        :rules="dOBRules"
                                                        prepend-icon="event"
                                                        readonly
                                                ></v-text-field>
                                                <v-date-picker v-model="editDOB" no-title scrollable actions required>
                                                    <template slot-scope="{ save, cancel }">
                                                        <v-card-actions>
                                                            <v-spacer></v-spacer>
                                                            <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
                                                            <v-btn flat color="primary" @click="save">OK</v-btn>
                                                        </v-card-actions>
                                                    </template>
                                                </v-date-picker>
                                            </v-menu>
                                        </v-flex>

                                        <!--Clinic Details-->
                                        <v-flex xs12>
                                            <v-text-field
                                                    label="Clinical Details"
                                                    :rules="textRules"
                                                    v-model="editClinDetails"
                                                    multi-line></v-text-field>
                                        </v-flex>

                                        <!--Diagnosis-->
                                        <v-flex xs12>
                                            <v-text-field
                                                    label="Diagnosis"
                                                    :rules="textRules"
                                                    v-model="editDiagnosis"
                                                    multi-line></v-text-field>
                                        </v-flex>

                                        <!--Investigations-->
                                        <v-flex xs12>
                                            <h3>Investigations:</h3>
                                            <!--<v-subheader>Investigations</v-subheader>-->
                                            <v-text-field
                                                    label="Blood Picture"
                                                    :rules="textRules"
                                                    v-model="editBloodPic"></v-text-field>
                                            <v-text-field
                                                    label="Bone Marrow"
                                                    :rules="textRules"
                                                    v-model="editBoneMarrow"></v-text-field>
                                            <v-text-field
                                                    label="Bio Chemistry"
                                                    :rules="textRules"
                                                    v-model="editBioChemistry"></v-text-field>
                                        </v-flex>

                                        <!--Treatment-->
                                        <v-flex xs12>
                                            <v-text-field
                                                    label="Treatment"
                                                    :rules="textRules"
                                                    v-model="editTreatment"
                                                    multi-line></v-text-field>
                                        </v-flex>

                                        <v-flex xs12>
                                            <p>Entry Date: {{editEntryDate}}</p>
                                        </v-flex>
                                    </v-form>
                                </v-layout>
                            </v-container>
                            <small>*indicates required field</small>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" flat @click.native="editDialog = false">Close</v-btn>
                            <v-btn color="blue darken-1" flat @click.native="editPatient"
                                   :disabled="(!validEdit)"
                            >Save Changes</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-layout>
        </v-flex>

        <!--Patient Table-->
        <v-flex xs12>
            <v-layout justify-center v-if="(loggedin)&&(!loading)">
                <v-alert v-if="patients.length==0"  color="warning" icon="warning" value="true" style="width: 800px; height: 50px">
                    <v-layout justify-center>
                    There are no patients registered in the database.
                    </v-layout>
                </v-alert>
                <v-card v-if="!(patients.length==0)">
                    <v-card-title>
                        Patients
                        <v-spacer></v-spacer>
                        <v-text-field
                                append-icon="search"
                                label="Search"
                                single-line
                                hide-details
                                v-model="search"
                        ></v-text-field>
                    </v-card-title>
                    <v-data-table
                            v-bind:headers="headers"
                            v-bind:items="patients"
                            v-bind:search="search"
                            hide-actions
                            dark
                            style="width: 850px; padding: 10px"
                            item-key="clinic_id"
                            hide-headers
                    >
                        <template slot="items" slot-scope="props">
                            <tr @click="props.expanded = !props.expanded">
                                <td class="text-xs-right">{{ props.item.name }}</td>
                                <td class="text-xs-right">{{ props.item.clinic_id }}</td>
                                <td class="text-xs-right" hidden>{{ props.item.diagnosis }}</td>
                            </tr>
                        </template>
                        <template slot="expand" slot-scope="props">
                            <v-layout row wrap>
                                <v-flex xs12 style="max-width: 830px; word-wrap: break-word;">
                                    <v-card flat>
                                        <v-card-text>
                                            <p>Date of Birth: <strong style="font-size: 14px">{{props.item.dOB}}</strong></p>
                                            <p>Clinic Details: <strong style="font-size: 14px">{{props.item.clinic_details}}</strong></p>
                                            <p>Diagnosis: <strong style="font-size: 14px">{{ props.item.diagnosis }}</strong></p>
                                            <p><u>Investigations:</u></p>
                                            <p style="padding-left: 50px">Blood Picture: <strong style="font-size: 14px">{{props.item.blood_picture}}</strong></p>
                                            <p style="padding-left: 50px">Bone Marrow: <strong style="font-size: 14px">{{props.item.bone_marrow}}</strong></p>
                                            <p style="padding-left: 50px">Bio Chemistry: <strong style="font-size: 14px">{{props.item.bio_chem}}</strong></p>
                                            <p>Treatment: <strong style="font-size: 14px">{{props.item.treatment}}</strong></p>
                                            <p>Entry Date: <strong style="font-size: 14px">{{props.item.entry_date}}</strong></p>
                                        </v-card-text>
                                    </v-card>
                                </v-flex>


                                <v-flex xs10 offset-xs1>
                                    <v-btn block color="warning" dark @click="editingPatient(props.item)">Edit Patient</v-btn>
                                    <v-btn block color="error" dark @click="deletePatient(props.item.clinic_id)">Delete Patient</v-btn>
                                </v-flex>
                            </v-layout>
                        </template>
                    </v-data-table>
                </v-card>
            </v-layout>
        </v-flex>
        <v-flex xs12 v-if="(loggedin)&&(!loading)">
            <v-layout>
                <v-spacer></v-spacer>
                <v-dialog v-model="infoDialog" max-width="700">
                    <v-btn color="primary" dark slot="activator">About</v-btn>
                    <v-card>
                        <v-card-title class="headline">αἷμα(Aima) PMS-Online - Alpha Release v0.0.0.0</v-card-title>
                        <v-card-text>A patient management application that can store, edit and search data of patients
                            which is stores in a Mongo DB database. This product is still in alpha release thus keep
                            in mid errors are likely to happen and no responsibility will be taken from the developer's
                            side due to any fault. If necessary contact via e-mail.<br>( damitha.15@cse.mrt.ac.lk ).</v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="red darken-3" flat @click.native="infoDialog = false">Close</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-layout>
        </v-flex>

    </v-layout>
</template>

<script>
//    import VSubheader from "vuetify/src/components/VSubheader/VSubheader";

    import fs from 'fs';
    import crypto from 'crypto';
    import bcrypt from 'bcryptjs';
//import VIcon from "vuetify/src/components/VIcon/VIcon";

    export default {
//        components: {VSubheader},
//        components: {VIcon},
        name: 'home',
        data() {
            return {
                msg: 'Welcome to Your Vue.js App',
//                max25chars: (v) => v.length <= 25 || 'Input too long!',
                tmp: '',
                search: '',

                notifications: false,
                sound: true,
                widgets: false,

//                Messages
                errorMsg:'Connection Error',
                loginMsg:'',

//                States
                loggedin:false,
                initFound:false,
                noInit:false,
                otherError:false,
                loginError:false,
                loading:false,

//                Dialog Controller
                addNewDialog: false,
                loginDialog: false,
                initDialog:true,
                editDialog:false,
                infoDialog:false,

//                Form Validator
                validNew:true,
                validIniti:true,
                validLogin:true,
                validEdit:true,

//                Date Controller
                newDate: null,
                menu: false,
                modal: false,

//                New Patient Data
                newName:null,
                newClinType:null,
                newClinNumber:null,
                newDOB:null,
                newClinDetails:null,
                newDiagnosis:null,
                newBloodPic:null,
                newBoneMarrow:null,
                newBioChemistry:null,
                newTreatment:null,

//                New Intialization Data
                iniURL:'',
                iniName:'',
                iniPW:'',
                iniConfPW:'',
                iniSecret:'',
                iniConfSecret:'',
                iniExisting:false,

//                Login Data
                loginUN:'',
                loginPW:'',
                loginSecret:'',
                loadingPW:false,

//                Edit Patient Data
                editName:null,
                editID:null,
                editDOB:null,
                editClinDetails:null,
                editDiagnosis:null,
                editBloodPic:null,
                editBoneMarrow:null,
                editBioChemistry:null,
                editTreatment:null,
                editEntryDate:null,


//                Rules
                textRules: [
                    (v) => !!v || 'Required'
                ],
                cNumRules: [
                    (v) => !!v || 'Required'
                ],
                pwRules: [
                    (v) => !!v || 'Password is required',
                    (v) => v && v.length <= 15 || 'Password must be less than 15 characters'
                ],
                secretRules: [
                    (v) => !!v || 'Secret is required',
                    (v) => v && v.length >= 10 || 'Password must be more than 10 characters'
                ],
                dOBRules: [
                    (v) => !!v || 'Date of Birth is required',
                    (v) => (new Date(v)) < (new Date()) || 'The date of birth must be before the current date'
                ],

                pagination: {},
                headers: [
                    {
                        text: 'Name',
                        value: 'name',
                    },
                    { text: 'Clinic ID', value: 'clinic_id' },
                    { text: 'Diagnosis', value: 'diagnosis' }
                ],
//                patients: [
//                    {
//                        value: false,
//                        name: 'Frozen Yogurt',
//                        calories: 159,
//                        fat: 6.0,
//                        carbs: 24,
//                        protein: 4.0,
//                        sodium: 87,
//                        calcium: '14%',
//                        iron: '1%'
//                    }
//                ]
            }
        },
        computed:{
            conError(){
                return this.$store.getters.conError;
            },
            dbPass(){
                return this.$store.getters.loginPass
            },
            patients(){
                return this.$store.getters.loadedPatients
            },
            existingPatient(){
                return this.$store.getters.matchPatients
            },
            activeFab () {
                switch (this.tabs) {
                    case 'one':
                        return {'class': 'purple', icon: 'account_circle'}
                    case 'two':
                        return {'class': 'red', icon: 'edit'}
                    case 'three':
                        return {'class': 'green', icon: 'keyboard_arrow_up'}
                    default:
                        return {}
                }
            }
        },
        methods: {
            open(link) {
                this.$electron.shell.openExternal(link)
            },
            clear () {
                this.$refs.newForm.reset()
            },
            clearIniti () {
                this.$refs.iniForm.reset()
            },

            addNewPatient(){
                this.loading=true;
                this.$store.commit('createPatient',{
                    name:this.newName,
                    clinic_id:this.newClinType+"-"+this.newClinNumber,
                    dOB:this.newDOB,
                    clinic_details:this.newClinDetails,
                    diagnosis:this.newDiagnosis,
                    blood_picture:this.newBloodPic,
                    bone_marrow:this.newBoneMarrow,
                    bio_chem:this.newBioChemistry,
                    treatment:this.newTreatment,
                    entry_date:this.formatDate(Date()).toString()
                });
                this.addNewDialog = false
                setTimeout(()=> {
                    this.$store.dispatch('loadPatients');
                }, 3000);
                setTimeout(()=> {
                    this.loading=false;
                }, 4000);

            },

            editPatient(){
                if (confirm("Apply the changes made to this patient?") === true) {
                    this.loading = true;
                    this.$store.commit('editPatient', {
                        name: this.editName,
                        clinic_id: this.editID,
                        dOB: this.editDOB,
                        clinic_details: this.editClinDetails,
                        diagnosis: this.editDiagnosis,
                        blood_picture: this.editBloodPic,
                        bone_marrow: this.editBoneMarrow,
                        bio_chem: this.editBioChemistry,
                        treatment: this.editTreatment
                    });
                    this.editDialog = false;
                    setTimeout(() => {
                        this.$store.dispatch('loadPatients');
                    }, 3000);
                    setTimeout(() => {
                        this.loading = false;
                    }, 4000);
                }
            },

            deletePatient(clinic_id){
                if (confirm("Are you sure you want to delete this patient?") === true) {
                    this.loading = true;
                    this.$store.commit('deletePatient', {
                        clinic_id: clinic_id
                    });
                    setTimeout(() => {
                        this.$store.dispatch('loadPatients');
                    }, 3000);
                    setTimeout(() => {
                        this.loading = false;
                    }, 4000);
                }

            },
            initialize () {
                if (this.$refs.iniForm.validate()) {
                    var enc=crypto.createCipher("aes-256-ctr",this.iniSecret).update(this.iniURL,"utf-8","hex");
                    var url = JSON.stringify({url: enc});
                    fs.writeFile('configAima.json', url, 'utf8', (error) => {
                        if (error) {
                            this.otherError = true;
                            this.errorMsg = "Error when creating initial file. Try again.";
                            console.log(error);
                        }
                        else {
                            sessionStorage.setItem("secret",this.iniSecret);
                            this.$store.dispatch('connectToDB', {url: this.iniURL});
                            if(!this.iniExisting) {
                                this.$store.dispatch('makeAdmin', {username: this.iniName, pw: this.iniPW});
                            }
                            this.noInit = false;
                            this.initDialog = false;
                        }
                    });
                }

            },
            login(){
                if (this.$refs.loginForm.validate()) {
//                    var enc=crypto.createCipher("aes-256-ctr",this.iniSecret).update(this.iniURL,"utf-8","hex");
//                    var url = JSON.stringify({url: enc});
                    fs.readFile('configAima.json', 'utf8', (err, data) =>{
                        if (err){
                            this.loginError = true;
                            this.loginMsg = "Error when accessing config file. Try again.";
                            console.log(error);
                        } else {
                            sessionStorage.setItem("secret",this.loginSecret);
                            var configData = JSON.parse(data); //now it an object
                            var mongoURL=crypto.createDecipher("aes-256-ctr",this.loginSecret).update(configData.url,"hex","utf-8");
                            this.$store.dispatch('connectToDB',{url:mongoURL}).then(()=>{
                                this.$store.dispatch('getPass',{username:this.loginUN}).then(()=>{
                                    this.loadingPW=true;
                                    setTimeout(()=> {
//                                        console.log(this.dbPass);
                                        bcrypt.compare(this.loginPW, this.dbPass, (err, res)=> {
                                            if (res){
                                                this.loggedin=true;
                                                this.$store.dispatch('loadPatients');
                                            }
                                            else{
                                                this.loginMsg="The username or password is incorrect. Try again.";
                                                this.loginError=true;
                                            }
                                        });
                                        this.loadingPW=false;
                                    }, 3000);
                                })
                            });
//                            this.$store.dispatch('connectToDB',{url:mongoURL});

                        }
                    });
                }
            },
            connectToDB(mongoURL){
                this.$store.dispatch('connectToDB',{url:mongoURL});
//                return "ad";
            },
            getPass(){
                this.$store.dispatch('getPass',{username:this.loginUN});
//                return 'ads'
            },
            checkPatientInDB(){
                setTimeout(()=> {
                    this.$store.dispatch('checkPatientInDB',{pat_id:this.newClinType+"-"+this.newClinNumber});
                }, 100);
            },
            formatDate(date) {
                var d = new Date(date),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();

                if (month.length < 2) month = '0' + month;
                if (day.length < 2) day = '0' + day;

                return [year, month, day].join('-');
            },
            editingPatient(patient){
                this.editDialog=true;
                this.editName=patient.name;
                this.editID=patient.clinic_id;
                this.editDOB=patient.dOB;
                this.editClinDetails=patient.clinic_details;
                this.editDiagnosis=patient.diagnosis;
                this.editBloodPic=patient.blood_picture;
                this.editBoneMarrow=patient.bone_marrow;
                this.editBioChemistry=patient.bio_chem;
                this.editTreatment=patient.treatment;
                this.editEntryDate=patient.entry_date;
            }
        },
        mounted(){
            fs.readFile('configAima.json', 'utf8', (err, data) =>{
                if (err){
                    this.noInit=true;
                    console.log(err);
                } else {
                    this.loginDialog=true;
//                    this.initFound=true;
//                    console.log(sessionStorage.getItem("secret"));
//                    var configData = JSON.parse(data); //now it an object
//                    var secr=sessionStorage.getItem("secret");
//                    console.log(crypto.createDecipher("aes-256-ctr",secr).update(configData.url,"hex","utf-8"))
//                    this.$store.dispatch('connectToDB',{url:configData.url});
                }
            });

        }
    }
</script>

<style scoped>
    .centered {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .logo {
        max-width: 100%;
    }

    .link-btn {
        width: 150px;
    }
</style>
