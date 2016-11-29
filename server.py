from flask import Flask, render_template, redirect, request, session, flash, jsonify
from dotenv import load_dotenv, find_dotenv
import heapq
import os
import sys
import json


load_dotenv(find_dotenv())
tmp_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'templates')
app = Flask('Connect',template_folder=tmp_dir)


with open('points.json') as json_file:
    pointsJSON = json.load(json_file)

def add2way_vertex(origin,destination,distance):
    g.add_vertex(origin,{destination:distance})
    g.add_vertex(destination,{origin:distance})

class Graph:

   def __init__(self):
       self.vertices = {}


   def add_vertex(self, name, edges):

       if name in self.vertices:
           self.vertices[name].update(edges)
       else:
           self.vertices[name] = edges

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
       return distances

   def __str__(self):
       return str(self.vertices)

if __name__ == '__main__':
   g = Graph()

concourses = [{'name':'A', 'longitude':'-84.439175'},
              {'name':'B', 'longitude':'-84.435897'},
              {'name':'C', 'longitude':'-84.432600'},
              {'name':'D', 'longitude':'-84.429307'},
              {'name':'E', 'longitude':'-84.425720'},
              {'name':'F', 'longitude':'-84.419815'}
]


E_horizontal = ["E14","E15","E16","E17","E18"]
json_len = len(pointsJSON)
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
              pointsJSON.append(centerh)

              cen_h = {}
              gat_h = {}
            #   cen_h[centerh['name']] = 45
            #   gat_h[pointsJSON[i]['name']] = 45
            #   g.add_vertex(pointsJSON[i]['name'], cen_h)
            #   g.add_vertex(centerh['name'], gat_h);
              add2way_vertex(centerh['name'],pointsJSON[i]['name'],45)

json_len = len(pointsJSON)
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
            center['name'] = gate['name']
            center['poi_type'] = 'center'
            center['concourse'] = gate['concourse']
            # // Add new point to JSON points list
            pointsJSON.append(center)
            cen_name = center['name']
            gat_name = gate['name']
            # cen = {}
            # gat = {}
            # cen[cen_name] =  46 #46 ft is half the approximate width of a concourse
            # gat[gat_name] = 46
            # # // Add vetices for new point (one in each direction)
            # g.add_vertex(gate['name'], cen)
            # g.add_vertex(center['name'], gat)
            add2way_vertex(gate['name'],center['name'],46)
# connect the center line points
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
        add2way_vertex(midpoint_arr[i]['name'],midpoint_arr[i+1]['name'],dist)

add2way_vertex('TR','AL',300)
add2way_vertex('AR','BL',300)
add2way_vertex('BR','CL',300)
add2way_vertex('CR','DL',300)
add2way_vertex('DR','ES',300)
g.add_vertex('TR',{'AR':300})
g.add_vertex('AR',{'BR':300})
g.add_vertex('BR',{'CR':300})
g.add_vertex('CR',{'DR':300})
g.add_vertex('DR',{'ES':300})
g.add_vertex('ES',{'DL':300})
g.add_vertex('DL',{'CL':300})
g.add_vertex('CL',{'BL':300})
g.add_vertex('BL',{'AL':300})
# g.add_vertex('AL',{'TL':300})

origin = 'A32'
destination = 'C3'
shor_test_path = g.shortest_path(origin,destination);
shor_test_path.append(origin);

@app.route('/shortest_path')
def shortest_Path():
    return jsonify(shor_test_path);

@app.route('/all_points')
def all_points():
    return jsonify(pointsJSON);

print g
print len(pointsJSON)
print "The shortest Path"
print shor_test_path


app.run(debug=True)
