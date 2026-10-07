# TamircimNerede (WhereIsMyRepairman)
TamircimNerede (WhereIsMyRepairman) is a web platform where you can find all kinds of repair shops (desktop PC, laptop, phone, tablet, etc.) on an interactive map.

You can filter repair shops directly on the map, search by name, and apply detailed filters.

The interface is intentionally kept simple and effective. The repair shop you are looking for is just a click away.

Once you find a repair shop, you can view detailed information, call them with a single click, and get directions via Google Maps.

## What makes this different from Google Maps?

1-) See all repair shops in one place: On Google Maps, you have to search individually for things like "phone repair near me" or "appliance repair near me," which wastes time.

2-) Distinction between Independent and Authorized Service Centers: Google Maps typically lists independent repair shops (which may void warranties). On our platform, you can even see manufacturer-authorized service centers—eliminating guesswork about where they are based or how quickly they can arrive.

## Concerns about spam or fake listings

No need to worry! Anyone can't just casually add a repair shop. When a listing is submitted, an application form must be filled out, and no repair shop is added without approval from site administrators!

## Tech Stack

**Frontend:** HTML5, CSS3, Vanilla JavaScript, Maplibre GL JS

**Backend:** Node.js, Express.js, Nodemailer, CORS & Body-Parser

**Database:** SQLite

## How to Install

After setting up the project files on your computer, open PowerShell (or CMD), navigate to the project directory, and run:
`node server.js`

You can then access the website at `localhost:8000` (or `<vds_ip_address>:8000` if you are using a VPS/VDS)!

# Email Notification Setup

The website includes an email notification system for business listing applications. To set it up:

1-) Set up a Google account.

2-) Open Gmail and click on "Manage your Google Account".

3-) Go to "Security" and enable 2-Step Verification (skip this step if already active).

4-) Return to the "Manage your Google Account" menu and search for "App Passwords" in the search bar.

5-) Enter an app name and copy the generated app password (in the format **abcd defg hijk lmno**).

6-) In the `server.js` file:

    auth: {
        user: 'youremail@gmail.com', // Your email address
        pass: '' // Your email password (requires an App Password for Gmail)
    }

Replace `user` with your email address and `pass` with your generated app password.

## demo: [http://185.23.17.147:3000](http://185.23.17.147:3000)

### Note: The core functionalities of the website are currently complete, and updates will continue to be rolled out in the future.