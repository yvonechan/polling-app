db.getSiblingDB("admin").auth(
	process.env.MONGO_INITDB_ROOT_USERNAME,
	process.env.MONGO_INITDB_ROOT_PASSWORD
);
print("CREATING USER");
db = db.getSiblingDB("mydb");
db.createUser({
	user: "user",
	pwd: "userpasswd",
	roles: [
		{
			role: "readWrite",
			db: "mydb",
		},
	],
});
