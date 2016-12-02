# The "A" Team - AirNav
<img src="static/img/white_logo.png" alt="Logo" width="150px"/>
######
[Live Project](http://http://52.40.91.213/#/home)   |  [Overview](https://github.com/DigitalCrafts-September-2016-Cohort/the_a_team2#overview)   |   [Team](https://github.com/DigitalCrafts-September-2016-Cohort/the_a_team2#team-members--roles)   |   [What We Used](https://github.com/DigitalCrafts-September-2016-Cohort/the_a_team2#what-we-used)   |   [MVP](https://github.com/DigitalCrafts-September-2016-Cohort/the_a_team2#mvp-minimum-viable-product)   |   [Challenges](https://github.com/DigitalCrafts-September-2016-Cohort/the_a_team2#challenges--solutions)   |   [Code](https://github.com/DigitalCrafts-September-2016-Cohort/the_a_team2#code-snippets)   | [Screenshots](https://github.com/DigitalCrafts-September-2016-Cohort/the_a_team2#screenshots)   |   [Contributing](https://github.com/DigitalCrafts-September-2016-Cohort/the_a_team2#contribute-to-airnav)


## Overview:
Atlanta Airport Navigation (AirNav) is a web application designed to help Atlanta
Airport travelers navigate the world's busiest airport. Hartsfield-Jackson Atlanta
International Airport, known locally as Atlanta Airport, is located 7 miles south
of the central business district of Atlanta. The Atlanta Airport has 5 runways,
7 concourses and 209 domestic and international gates, so AirNav was built to
help the millions of travelers that come through the Atlanta Airport to easily
navigate their way from terminal to terminal, find restaurants or shopping along
the way, as well as locate their baggage and ground transportation.


**Our conceptual goals for the site:**
* Turn-by-turn directions, map view as well as list view
* User-generated location with map points
* List of all points of interest along route to gate destination
* Deploy as a web app as well as on Ionic

##Github Link:
[AirNav](https://github.com/DigitalCrafts-September-2016-Cohort/the_a_team2.git)

##Team Members & Roles:
**Click on each member's name to see their GitHub profile**
All team members are students in the [Digital Crafts](https://digitalcrafts.com) September 2016 cohort. This project was initially completed as the second project for that curriculum and utilized the SCRUM development process and philosophy.  Paired and mob programming were the focus in the initial and final stages, while mid- and late-stage work was primarily completed through individual but coordinated and co-located programming.

####The A Team
* [Jesslyn Landgren](https://github.com/jesslynlandgren/)  
**Primary team role:** Front-end Gladiator/Back-end backup, styling<br />
**Contributions:**  Provided initial project concept. Built a custom, responsive layout from scratch with focus on clean, robust design. Helped Keyur build out initial front-end and back-end, then assisted with troubleshooting throughout project. Led team in continuously evaluating user-interface and user-experience of site, including semantics and critique of supported functionalities. Led the charge on all things visual/client-facing. Organized site navigation.<br />
**Key code portions:** Most of the HTML, CSS and JavaScript.

* [Keyur Patel](https://github.com/ekeyur/)  
**Primary team role:** Back-end Soldier<br />
**Contributions:** Built a custom, responsive layout from scratch with focus on clean, robust design. Wrote and refactored HTML/CSS with an emphasis on simplicity, clarity, and flexibility.  Made sure that we were pulling the right information from the database in the right places.<br />
**Key code portions:** Most of the JavaScript code (server.py) and HTML documents

* [Jason Campbell](https://github.com/mtnzorro/)  
**Primary team role:** Ionic Trooper, styling<br />
**Contributions:** Site design and implementation. Just making sure the manipulation and display of the data in the database was working well with the design concept. Regularly studied all code throughout project.<br />
**Key code portions:** All of the ionic code

* [Trista McCleary](https://github.com/mccleary/)  
**Primary team role:** UI/UX chief, prototype, styling<br />
**Contributions:** Scrum master. Led daily stand up meetings and maintained virtual scrum board. App name, app logo. Assisted with all things visual/client-facing. Regularly studied all code throughout project.<br />
**Key code portions:** UI/UX mock-ups, shell HTML, README file

##What we used:
**Languages:**  
* Python (including the following modules)
  * heapq
  * jSON
  * os,io
  * dotenv
  * csv
* HTML5
* CSS
* JavaScript
* AngularJS
* Ionic

**Frameworks:**  
* Flask
* Bootstrap
* Mapbox
* Leaflet

**Other:**  
* Icons from the Font Awesome
* API
* Sketch
* InVision
* Dijkstra's algorithm


##MVP (Minimum Viable Product):
This was the first GeoMapping and Ionic project for all team members. One challenge we faced was a blurring the line between our MVP and stretch goals due to a desire to make efficient use of our time, what functionalities were required and which were desired from a users standpoint. Deploy first, Code later method.

**Initial MVP**
* Point-to-point navigation
* Creating Network
* Query route
* Show routes in terms of time
* Display gate-to-gate route on a map
* Turn-by-turn directions, list view
* Search for destinations, suggestive search
* Auto-detect user location and follow
* Points of Interest along the route (restaurants, shopping, restrooms)

We started incorporating stretch goals about two days before the project deadline (as soon as we knew that we would be able to reach MVP ahead of the deadline), but before our MVP was officially deployed.

**Stretch Goals**
* Site responsiveness
* Shortest path between nodes in the graph
* Suggestive search
* Search box with drop-down for sub-categories(food, shop, baggage)
* Style map points
* App functionality in Ionic
* Actual Airport walk-thru

## Challenges & Solutions:
**Some of the biggest challenges we faced with this project build included:**

1.  **Challenge:** Dijkstra's algorithm  

    **Solution:** Still trying to fully wrap our heads around this one. We continually went through the code, watched youtube explanations and walked through the code line-by-line as if in Python Tutor.  

2.  **Challenge:** Ionic Implementation

    **Solution:** Enlisted guidance from Matthew Brimmer, Teaching Assistant for our cohort, with previous Ionic experience.
    <!-- Ionic is the only mobile app stack that enables web developers apps for all major app stores and the mobile web with a single code base. Ionic Framework offers the best web and native app components for building highly interactive native and progressive web apps with Angular. -->

3.  **Challenge:** Shortest route results

    **Solution:** Dijkstra's algorithm

4. **Challenge:** Suggested stopping points along route to intended endpoint


##Code Snippets

<!-- Insert code here -->


## View AirNav Screenshots Here:
![Homepage](static/img/Homepage.png)
![Search](static/img/search.png)
![Search Results](static/img/search_results.png)
![Gate location](static/img/gate_location.png)
![Map View](static/img/map_view.png)
![Directions List View](static/img/list_view.png)
![iPhone6](static/img/iphone6.png)
![iPhone6 without Menu](static/img/iphone6_nomenu.png)
![iPad](static/img/ipad.png)
![Andriod](static/img/andriod.png)


## Airport Terminal Maps:
![Concourse A](static/img/concourse_a.png)
![Concourse B](static/img/concourse_b.png)
![Concourse C](static/img/concourse_c.png)
![Concourse D](static/img/concourse_d.png)
![Concourse E](static/img/concourse_e.png)
![Concourse F](static/img/concourse_f.png)
![Concourse T](static/img/concourse_t.png)
![Domestic Terminal](static/img/domestic_terminal.png)


URL: http://52.40.91.213/#/home

********

#Contribute to AirNav

## 3 Desired Contributions We would like to see :
1. App reviews from users traveling through Atlanta Airport
2. Restaurant suggestions for user, based on food preference/allergies
3. Restaurant reviews, Yelp style


##Contributing
1. Fork it
2. Create a new feature branch (named after your intended feature): `git checkout -b new-feature-name`
3. Commit your changes: `git commit -am 'Added the feature!'`
4. Push to your feature branch: `git push origin new-feature-name`
5. Submit a pull request!


##Project History
12/2/2016 - Project Completion and Deployment  
11/28/2016 - Project Start  
