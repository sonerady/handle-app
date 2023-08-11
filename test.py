app.secret_key = "lvlvlvlv"
uri = "mongodb+srv://hypergpt:OIBKmPKKP0tsFXWm@hyperdao.qnh0sbu.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(uri)
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)
db = client.hyperdiscord
    


config = {
	"client_id": "1121395648437174313",
	"client_secret": "wrQbOIq8mP3wFCaxyibD0tfHJAVAL_Od",
	"callback_url": "https://hyperdiscort.azurewebsites.net/auth/callback"
}

# Discord config

discordConfig = {
	"api": "https://discord.com/api/v10"
	
}



# HTML
@app.route("/")
def home():
	session_token = session.get("access_token", None)
	if session_token != None:
		response = requests.get(f"{discordConfig['api']}/users/@me", headers={"Authorization": f"Bearer {session_token}"})
		return render_template("index.html", data={"logged": True, "responseData": response })
	else:
		return render_template("index.html", data={"logged": False })

# Login
@app.route("/auth/login")
def loginAuth():
	if session.get('access_token', None) == None:
		return redirect(f"https://discord.com/api/oauth2/authorize?client_id=1121395648437174313&permissions=8&redirect_uri=https%3A%2F%2Fhyperdiscort.azurewebsites.net%2Fauth%2Fcallback&response_type=code&scope=identify%20email%20guilds.join%20guilds%20connections%20guilds.members.read%20bot")
	else:
		return redirect("/")

# Callback handle
@app.route("/auth/callback")
def callbackAuth():
	args = request.args
	
	# Code
	code = args.get('code', None)
	if code == None:
		return jsonify({"success": False, "message": "Invalid code"})
	else:
		payload = {
			"client_id": config['client_id'],
			"client_secret": config['client_secret'],
			"grant_type": "authorization_code",
			"code": code,
			"redirect_uri": config['callback_url'],
			"scope": "identify"
		}

		headers = {
			"Content-Type": "application/x-www-form-urlencoded"
		}
		response = requests.post(f"{discordConfig['api']}/oauth2/token", headers=headers, data=payload)
		
	
		access_token = response.json()['access_token']
		session['access_token'] = access_token
		session['refresh_token'] = response.json()['refresh_token']




		
		return access_token

# Auth information
@app.route("/auth/info")
def authInfo():
	access_token = 'XGNMUkfjsrvgCPke7xyF1Q2CVbplPs'
	if access_token == None:
		return jsonify({"success": False, "message": "Expire session"})
	else:
		headers = {
			"Authorization": f"Bearer {access_token}"
		}
		response = requests.get(f"{discordConfig['api']}/users/@me", headers=headers)
		x=jsonify(response.json())
		username=x.json['username']
		global_name=x.json['global_name']
		discord_id=x.json['id']
		
		sonuc={
			"username":str(username),
			"global_name":str(global_name),
			"discord_id":str(discord_id),
			"discord_token":str(access_token)

 				

		}
		
		chech_user=list(db.discord_user.find({"discord_id":x.json['id']}))
		print(len(chech_user))
		if len(chech_user) == 0:
			kayit=db.discord_user.insert_one(sonuc)
			print("user added")
		else:
			print("user already exist")

			sonucx=json.dumps(sonuc,indent=4, default=json_util.default)

			return sonuc
		
		sonucx=json.dumps(sonuc,indent=4, default=json_util.default)
		  
		return sonucx