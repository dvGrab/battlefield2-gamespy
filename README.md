### Features

This software will become one of the most and easy to setup Gamespy Emulators for Battlefield 2, fully compatible on all plattforms that support Node.JS. At the current state, it only supports login to your account with any valid password, at later times, the database and GPSP + Masterserver will be added.

- Support of GPCM without database right now (login server)
- Lightweight and simple to understand
- Written completly in NodeJS / Typescript

### Setup
At this moment, there is no binary patcher nor client to update the bf2.exe to connect to the emulated service. All changes have to be done in your hosts (C:\Windows\system32\hosts)

    127.0.0.1 gpcm.gamespy.com
    127.0.0.1 gpsp.gamespy.com
    127.0.0.1 battlefield2.available.com

After this, make sure that BF2Hub patching is disabled, select the option at the client, or you'll always connect to the BF2Hub backends. 

Open the project and run **start.bat**, make sure to have the latest version of NodeJS installed. The project will be transpiled and the services will start.

Run Battlefield 2 and try to login to one account, at this moment, there is no included database and only GPCM (login server) with already existing accounts is supported. 

### Flow
**GPCM -> BF2 Login**

1. **BF2 connecting to GPCM**
   - A: BF2 initiates connection to GPCM.

2. **gpcm->client->send_challenge**
   - B: GPCM sends a challenge to the client.
   
3. **BF2 respond with challenge and details**
   - C: BF2 responds with the challenge and additional details.
   
4. **gpcm->client->parse_client & gpcm->client->send_login**
   - D: GPCM parses the client response and sends a login details.
   
5. **BF2 respond with profileid & session key**
   - E: BF2 responds with the profile ID and session key.
   
6. **gpcm->send_profile**
   - F: GPCM sends the profile information.

7. **BF2 logged in**
  - G: Battlefield2 is fully logged into the main menu.

### Credits
- [gs_login_server](https://code.google.com/archive/p/gsloginserver/ "gs_login_server") - A deep insight into the structures of the Gamespy backend
****