from flask import Flask, request, jsonify
# from dotenv import load_dotenv, find_dotenv
import heapq
import os,io
import sys
import json
import csv


app = Flask('Connect', static_url_path='')

with open('points.json') as json_file:
    pointsJSON = json.load(json_file)

# initial_pointsJSON = pointsJSON

initial_pointsJSON = [
	{
		"id": "1",
		"name": "A1",
		"latitude": "33.6375916",
		"longitude": "-84.439033",
		"poi_type": "gate",
		"concourse": "A"
	},
	{
		"id": "2",
		"name": "A2",
		"latitude": "33.637749",
		"longitude": "-84.4393355",
		"poi_type": "gate",
		"concourse": "A"
	},
	{
		"id": "3",
		"name": "A3",
		"latitude": "33.6379332",
		"longitude": "-84.4390335",
		"poi_type": "gate",
		"concourse": "A"
	},
	{
		"id": "4",
		"name": "A4",
		"latitude": "33.6382532",
		"longitude": "-84.4393433",
		"poi_type": "gate",
		"concourse": "A"
	},
	{
		"id": "5",
		"name": "A5",
		"latitude": "33.6382586",
		"longitude": "-84.4390341",
		"poi_type": "gate",
		"concourse": "A"
	},
	{
		"id": "6",
		"name": "A6",
		"latitude": "33.6386307",
		"longitude": "-84.4393492",
		"poi_type": "gate",
		"concourse": "A"
	},
	{
		"id": "7",
		"name": "A7",
		"latitude": "33.6385894",
		"longitude": "-84.4390346",
		"poi_type": "gate",
		"concourse": "A"
	},
	{
		"id": "8",
		"name": "A8",
		"latitude": "33.638845",
		"longitude": "-84.43932",
		"poi_type": "gate",
		"concourse": "A"
	},
	{
		"id": "9",
		"name": "A9",
		"latitude": "33.638969",
		"longitude": "-84.4390352",
		"poi_type": "gate",
		"concourse": "A"
	},
	{
		"id": "10",
		"name": "A10",
		"latitude": "33.6392544",
		"longitude": "-84.4393589",
		"poi_type": "gate",
		"concourse": "A"
	},
	{
		"id": "11",
		"name": "A11",
		"latitude": "33.639495",
		"longitude": "-84.439036",
		"poi_type": "gate",
		"concourse": "A"
	},
	{
		"id": "12",
		"name": "A12",
		"latitude": "33.6397045",
		"longitude": "-84.4393659",
		"poi_type": "gate",
		"concourse": "A"
	},
	{
		"id": "13",
		"name": "A13",
		"latitude": "33.639763",
		"longitude": "-84.439032",
		"poi_type": "gate",
		"concourse": "A"
	},
	{
		"id": "14",
		"name": "A14",
		"latitude": "33.639968",
		"longitude": "-84.439327",
		"poi_type": "gate",
		"concourse": "A"
	},
	{
		"id": "15",
		"name": "A15",
		"latitude": "33.6400969",
		"longitude": "-84.4390369",
		"poi_type": "gate",
		"concourse": "A"
	},
	{
		"id": "16",
		"name": "A16",
		"latitude": "33.6403064",
		"longitude": "-84.4393752",
		"poi_type": "gate",
		"concourse": "A"
	},
	{
		"id": "17",
		"name": "A17",
		"latitude": "33.6404385",
		"longitude": "-84.4390374",
		"poi_type": "gate",
		"concourse": "A"
	},
	{
		"id": "18",
		"name": "A18",
		"latitude": "33.6406961",
		"longitude": "-84.4393386",
		"poi_type": "gate",
		"concourse": "A"
	}
]
l =  len(initial_pointsJSON)

def add2way_vertex(origin,destination,distance):
    g.add_vertex(str(origin),{str(destination):distance})
    g.add_vertex(str(destination),{str(origin):distance})

class Graph:

    def __init__(self):
       self.vertices = {}


    def add_vertex(self, name, edges):

        if name in self.vertices:
           self.vertices[name].update(edges)
        else:
           self.vertices[name] = edges

    def get_distance(self,origin,destination):
        return self.vertices[origin][destination]

    def shortest_path(self, start, finish):
        distances = {} # Distance from start to node
        previous = {}  # Previous node in optimal path from source
        nodes = [] # Priority queue of all nodes in Graph

        for vertex in self.vertices:
            if vertex == start: # Set root node as distance of 0
               distances[vertex] = 0
               heapq.heappush(nodes, [0, vertex])
            else:
               distances[vertex] = sys.maxsize
               heapq.heappush(nodes, [sys.maxsize, vertex])
            previous[vertex] = None

        while nodes:
            smallest = heapq.heappop(nodes)[1] # Vertex in nodes with smallest distance in distances
            if smallest == finish: # If the closest node is our target we're done so print the path
                path = []
                while previous[smallest]: # Traverse through nodes til we reach the root which is 0
                   path.append(smallest)
                   smallest = previous[smallest]
                return path
            if distances[smallest] == sys.maxsize: # All remaining vertices are inaccessible from source
               break

            for neighbor in self.vertices[smallest]: # Look at all the nodes that this vertex is attached to
                alt = distances[smallest] + self.vertices[smallest][neighbor] # Alternative path distance
                if alt < distances[neighbor]: # If there is a new shortest path update our priority queue (relax)
                    distances[neighbor] = alt
                    previous[neighbor] = smallest
                    for n in nodes:
                        if n[1] == neighbor:
                           n[0] = alt
                           break
                    heapq.heapify(nodes)
        return None

    def __str__(self):
       return str(self.vertices)

# if __name__ == '__main__':
g = Graph()

print "initial  ",initial_pointsJSON[0]["id"]




concourses = [{'name':'A', 'longitude':'-84.439175'},
              {'name':'B', 'longitude':'-84.435897'},
              {'name':'C', 'longitude':'-84.432600'},
              {'name':'D', 'longitude':'-84.429307'},
              {'name':'E', 'longitude':'-84.425720'},
              {'name':'F', 'longitude':'-84.419815'}
]


E_horizontal = ["E14","E15","E16","E17","E18"]
json_len = len(pointsJSON)
point_id = 2000
for epoint in E_horizontal:
    for i in range(0,json_len):
        if epoint == pointsJSON[i]['name']:
            gate = pointsJSON[i]
            centerh = {}
            centerh['longitude'] = gate['longitude']
            centerh['latitude'] = "33.640631"
            centerh['name'] = epoint
            centerh['poi_type'] = "hcenter"
            centerh['concourse'] = "E"
            centerh['id'] = str(point_id)
            pointsJSON.append(centerh)
            add2way_vertex(str(point_id),pointsJSON[i]['id'],45)
        point_id += 1
json_len = len(pointsJSON)
point_id = 5000

# Code for adding vertical center points
for concourse in concourses:
    # // For each initial JSON point (from OpenStreetMap)
    for i in range (0, json_len):

        # // Only look at points (gates) in the current concourse
            # // Create new JSON point that connects JSON point (gate) to concourse centerline
        if pointsJSON[i]['concourse'] == concourse['name']:
            bool1 = pointsJSON[i]['name'][1:] in E_horizontal
            bool2 = pointsJSON[i]['name'] in E_horizontal
            if (not bool1 and not bool2):
                gate = pointsJSON[i]
                center = {}
            # // Longitude of new point is the centerline longitude of current concourse
                center['longitude'] = concourse['longitude']
            # // Latitude of new point is the same as the gate that we are connecting to concourse centerline
                center['latitude'] = gate['latitude']
            # // Name of new point is the same as the gate name but with a double letter for the concourse (ex: gate A1 connects to concourse centerline at point AA1)
                center['name'] = concourse['name']+ gate['name']
                center['poi_type'] = 'center'
                center['concourse'] = gate['concourse']
                center['id'] = str(point_id)
            # // Add new point to JSON points list
                pointsJSON.append(center)
                # cen_name = center['name']
                # gat_name = gate['name']
            # cen = {}
            # gat = {}
            # cen[cen_name] =  46 #46 ft is half the approximate width of a concourse
            # gat[gat_name] = 46
            # # // Add vetices for new point (one in each direction)
            # g.add_vertex(gate['name'], cen)
            # g.add_vertex(center['name'], gat)
            add2way_vertex(pointsJSON[i]['id'],str(point_id),46)
        point_id += 1
# connect the center line points

# print "JSON OBJECT"
# print pointsJSON

# with open('points.json', 'w'): pass
# with io.open('points.json', 'w', encoding='utf-8') as f:
#   f.write(unicode(json.dumps(pointsJSON, ensure_ascii=False)))


json_len = len(pointsJSON)
for concourse in concourses:
    # // Create empty structures
    concoursePoints = [];  #// stores names of all points in current concourse
    pointsSorted = {}; #// all points in current concourse sorted by latitude
    #// For each JSON point
    for i in range(0,json_len):
        #// If JSON point is in current concourse:
        if(pointsJSON[i]['concourse'] == concourse['name']):
            concoursePoints.append(pointsJSON[i])

    #// Sorting points for current concourse by latitude
    pointsSorted = sorted(concoursePoints,key=lambda k:k['latitude'])

    #// Create empty array for center line points
    midpoint_arr = []
    for point in pointsSorted:
        if(point['longitude'] == concourse['longitude']):
            midpoint_arr.append(point)

    #// For each center line point

    for i in range(0,len(midpoint_arr)-1):
        first = {}
        second = {}
        #// Getting latitude distance between points and converting to distance for edge definition
        dist = (float(midpoint_arr[i+1]['latitude']) - float(midpoint_arr[i]['latitude'])) * 363917.7912
        #// Setting edge for point i and point i+1
        # first[midpoint_arr[i]['name']] = dist
        # second[midpoint_arr[i+1]['name']] = dist
        # #// Adding vertices with edges from above
        # g.add_vertex(midpoint_arr[i]['name'],second)
        # g.add_vertex(midpoint_arr[i+1]['name'],first)
        add2way_vertex(midpoint_arr[i]['id'],midpoint_arr[i+1]['id'],dist)
terminal_distance = 120

add2way_vertex('294','295',terminal_distance)
add2way_vertex('296','295',terminal_distance)
g.add_vertex('295',{'293':terminal_distance})
g.add_vertex('293',{'291':terminal_distance})
g.add_vertex('291',{'289':terminal_distance})
g.add_vertex('289',{'287':terminal_distance})
g.add_vertex('287',{'285':terminal_distance})
g.add_vertex('290',{'292':terminal_distance})
g.add_vertex('286',{'288':terminal_distance})
g.add_vertex('292',{'294':terminal_distance})
g.add_vertex('288',{'290':terminal_distance})
g.add_vertex('285',{})
# add2way_vertex('285','287',terminal_distance)

# origin = 'A32'
# destination = 'C3'
# shor_test_path = g.shortest_path(origin,destination);
# shor_test_path.append(origin);

#---------------

#------------------
#all shortest paths
s_path_dict = {}
def all_s_paths(poi):
    for i in range(0,l):
        print i
        for j in range(1,l-1):
            temp_arr = g.shortest_path(poi[i]['id'],poi[j]['id'])
            if (temp_arr):
                temp_arr.reverse()
                dist_sum = 0
                for k in range(0,len(temp_arr)-1):
                    dist_sum += g.get_distance(temp_arr[k],temp_arr[k+1])
                s_path_dict[str(poi[i]['id'])+"-"+str(poi[j]['id'])+"-dist"] = dist_sum
                s_path_dict[str(poi[i]['id'])+"-"+str(poi[j]['id'])+"-route"] = temp_arr
# --------------------
# all_s_paths(initial_pointsJSON)
# with open('all_s_paths.json', 'w') as f:
#     json.dump(s_path_dict, f)
# -----------------------


@app.route('/')
def home():
    return app.send_static_file('index.html')

# route that returns the shortest_path array





@app.route('/shortest_path')
def shortest_Path():
    origin = '2'
    destination = '231'
    route_dict = {}
    instructions = []
    points_only = g.shortest_path(origin,destination)
    points_only.append(origin)
    points_only.reverse()
    points = []

    d_sum=0
    dist_to_dest = []
    for j in range(0,len(points_only)-1):
        d_sum += g.get_distance(points_only[j],points_only[j+1])
        dist_to_dest.append(d_sum)
    dist_to_dest.reverse()
    # print points_only
    for i in range(0,len(points_only)):
        for point in pointsJSON:
            if(point['id'] == points_only[i]):
                points.append({points_only[i]:{"latitude":point['latitude'],"longitude":point['longitude'],"poi_type":point['poi_type'],"concourse": point['concourse'],"name":point['name']}})
    
    for i in range(0,len(points)-2):
        v = points[i].values()[0]
        v1 = points[i+1].values()[0]
        v2 = points[i+2].values()[0]
        if v['poi_type'] == "gate" or v1['poi_type'] == "gate" or v['poi_type'] == "center" or v1['poi_type'] == "center":
            if ((float(v['latitude']) == float(v1['latitude'])) and (float(v['longitude']) < float(v1['longitude']))):
                instructions.append("Continue Forward East")
            elif ((float(v['latitude']) == float(v1['latitude'])) and (float(v['longitude']) > float(v1['longitude']))):
                instructions.append("Continue Forward West")
            elif ((float(v['longitude']) == float(v1['longitude'])) and (float(v['latitude']) < float(v1['latitude']))):
                instructions.append("Continue Forward North")
            elif ((float(v['longitude']) == float(v1['longitude'])) and (float(v['latitude']) > float(v1['latitude']))):
                instructions.append("Continue Forward South")
        if v1["poi_type"] == "escalator":
            if "Go Down Escalator and get on the train" in instructions:
                if v2["poi_type"] == "escalator":
                    instructions.append("Stay on the train")
                else:
                    instructions.append("Get off the train and go up the Escalator")
            else:
                    instructions.append("Go Down Escalator and get on the train")

    # print "instructions"
    # for i in instructions:
    #     print i

    return jsonify(points)
#route that returns all the points in the airport
@app.route('/all_points')
def all_points():
    return jsonify(pointsJSON);

#route that returns points that are searched by names
@app.route('/search')
def search():
    search = request.args.get('query').lower()
    # print search
    search_origin = '2'
    search_points = []
    if len(search)>0:
        for i in range(0,len(pointsJSON)):
            if search in pointsJSON[i]['name'].lower() and pointsJSON[i]['poi_type'] != "center" and pointsJSON[i]['poi_type'] != "hcenter":
                search_route = g.shortest_path(search_origin,pointsJSON[i]['id'])
                if search_route:
                    search_route.append(search_origin)
                    # Logic for making a has Table
# <<<<<<< HEAD
#
#                     temp_point = pointsJSON[i]
#                     if path_key in s_path_dict:
#                         temp_point['dist_from_origin'] = s_path_dict[path_key]
#                     else:
#                         dist_sum = 0
#                         for j in range(0,len(search_route)-1):
#                             dist_sum += g.get_distance(search_route[j],search_route[j+1])
#                         s_path_dict[path_key] = dist_sum
#                         temp_point['dist_from_origin'] = dist_sum
#         print search_points
#         print s_path_dict
# =======
                    dist_sum = 0
                    for j in range(0,len(search_route)-1):
                        dist_sum += g.get_distance(search_route[j],search_route[j+1])
                        time = int(dist_sum/270.)
                    temp_point = pointsJSON[i]
                    temp_point['time'] = time
                    temp_point['s_index'] = pointsJSON[i]['name'].lower().index(search)
                    search_points.append(temp_point)
        print search_points
        return jsonify(search_points)
    # elif len(search) > 0 and len(search) < 3:
    #     for i in range(0,len(pointsJSON)):
    #         if search in pointsJSON[i]['name'].lower() and pointsJSON[i]['poi_type'] == "gate":
    #             print pointsJSON[i]['id']
    #             search_route = g.shortest_path(search_origin,pointsJSON[i]['id'])
    #             if search_route:
    #                 search_route.append(search_origin)
    #                 dist_sum = 0
    #                 for j in range(0,len(search_route)-1):
    #                     dist_sum += g.get_distance(search_route[j],search_route[j+1])
    #                     time = int(dist_sum/270)
    #                 temp_point = pointsJSON[i]
    #                 temp_point['time'] = time
    #                 temp_point['s_index'] = pointsJSON[i]['name'].lower().index(search)
    #                 search_points.append(temp_point)
        # print search_points
        return jsonify(search_points)
app.run(debug=True)
print g.vertices['290']
