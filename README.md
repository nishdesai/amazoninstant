Amazon Instant
=======================
HDMafia Hackathon project

MongoLabs Database GUI:


###MongoDB


#####Start up the server

$ sudo mongod

#####Local Mongo shell

$ mongo


	Use a database

	> use <database>


	Show all db's

	> show dbs


	Show all collections

	> show collections


	Query all users

	> db.rooms.find()


	Find Specific User

	> db.rooms.findOne({name:'test_room_name'})


	Drop Specific collection

	> db.rooms.drop()


	Find All rooms with name

	> db.rooms.find({name: "test_room_name"})


	Multiple filters:

	Find All rooms with name and privacy setting

	> db.rooms.find({name: "test_room_name", privacy_setting: "blah" })