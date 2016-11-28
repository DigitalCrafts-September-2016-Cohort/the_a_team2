import heapq
import sys

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


pointsJSON = [

	{
		"longitude": "-84.439033",
		"latitude": "33.6375916",
		"name": "A1",
		"poi_type": "gate",
		"concourse": "A"
	},
	{
		"longitude": "-84.4390335",
		"latitude": "33.6379332",
		"name": "A3",
		"poi_type": "gate",
		"concourse": "A"
	},
	{
		"longitude": "-84.4393355",
		"latitude": "33.637749",
		"name": "A2",
		"poi_type": "gate",
		"concourse": "A"
	},
	{
		"longitude": "-84.4393433",
		"latitude": "33.6382532",
		"name": "A4",
		"poi_type": "gate",
		"concourse": "A"
	},
	{
		"longitude": "-84.4390341",
		"latitude": "33.6382586",
		"name": "A5",
		"poi_type": "gate",
		"concourse": "A"
	},
	{
		"longitude": "-84.4393492",
		"latitude": "33.6386307",
		"name": "A6",
		"poi_type": "gate",
		"concourse": "A"
	},
    {
		"longitude": "-84.4259055",
		"latitude": "33.6402222",
		"name": "E12",
		"poi_type": "gate",
		"concourse": "E"
	},
	{
		"longitude": "-84.424755",
		"latitude": "33.6409796",
		"name": "E14",
		"poi_type": "gate",
		"concourse": "E"
	},
	{
		"longitude": "-84.4241395",
		"latitude": "33.6405127",
		"name": "E15",
		"poi_type": "gate",
		"concourse": "E"
	},
	{
		"longitude": "-84.4236256",
		"latitude": "33.6407834",
		"name": "E16",
		"poi_type": "gate",
		"concourse": "E"
	},
	{
		"longitude": "-84.4235044",
		"latitude": "33.6405127",
		"name": "E17",
		"poi_type": "gate",
		"concourse": "E"
	},
	{
		"longitude": "-84.4232146",
		"latitude": "33.640801",
		"name": "E18",
		"poi_type": "gate",
		"concourse": "E"
	},
	{
		"longitude": "-84.42593",
		"latitude": "33.6414548",
		"name": "E26",
		"poi_type": "gate",
		"concourse": "E"
	}
    ]

concourses = [{'name':'A', 'longitude':'-84.439175'},
            #   {'name':'B', 'longitude':'-84.435897'},
            #   {'name':'C', 'longitude':'-84.432600'},
            #   {'name':'D', 'longitude':'-84.429307'},
              {'name':'E', 'longitude':'-84.425720'}
            #   {'name':'F', 'longitude':'-84.419815'}
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
              centerh['name'] = "H" + epoint
              centerh['poi_type'] = "ehcenter"
              centerh['concourse'] = "E"
              pointsJSON.append(centerh)

              cen_h = {}
              gat_h = {}
              cen_h[centerh['name']] = 45
              gat_h[pointsJSON[i]['name']] = 45
              g.add_vertex(pointsJSON[i]['name'], cen_h)
              g.add_vertex(centerh['name'], gat_h);


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
            center['name'] = concourse['name'] + gate['name']
            center['poi_type'] = 'center'
            center['concourse'] = gate['concourse']
            # // Add new point to JSON points list
            pointsJSON.append(center)
            cen_name = center['name']
            gat_name = gate['name']
            cen = {}
            gat = {}
            cen[cen_name] =  46 #46 ft is half the approximate width of a concourse
            gat[gat_name] = 46
            # // Add vetices for new point (one in each direction)
            g.add_vertex(gate['name'], cen)
            g.add_vertex(center['name'], gat)
print g

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
        first[midpoint_arr[i]['name']] = dist
        second[midpoint_arr[i+1]['name']] = dist
        #// Adding vertices with edges from above
        g.add_vertex(midpoint_arr[i]['name'],second)
        g.add_vertex(midpoint_arr[i+1]['name'],first)
print g
