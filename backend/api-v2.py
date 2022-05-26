import feature_extractor as fe
import os
import pickle
from flask import Flask,request, json
from flask_restful import Resource, Api, reqparse
from flask_cors import CORS
from flask import request, Response
import numpy as np
import PIL.Image as Image
import io
import base64
from struct import unpack
import pandas as pd
import sys
import glob
import pickle
import urllib3
#that's a lot of imports

http = urllib3.PoolManager()
app = Flask(__name__)
CORS(app)
api = Api(app)

parser = reqparse.RequestParser()
parser.add_argument("image")

class Predict(Resource):
    def post(self): 
        data = json.loads(request.data)
        image_array=[]
        for i in range(0,len(data)):
            image = http.request('GET', data[i])
            decodeit = open('./server_files/saveimg.jpeg', 'wb')
            decodeit.write(image.data)
            decodeit.close()
            fe.extract_features()
            model = pickle.load(open("./xgboost.pkl", 'rb'))
            test = pd.read_csv('test.csv',header=None)
            x_test = np.array(test.iloc[1:, 1:10])  
            y_test = np.array(test.iloc[1:, 11])  
            res = model.predict(x_test)
            print(res)
            if res == 0:
                image_array.append({
                    "src":data[i],
                    "status":"benign"
                })
            else:
                image_array.append({
                    "src":data[i],
                    "status":"malicious"
                })
        return image_array

api.add_resource(Predict, "/predict")

if __name__ == "__main__":
    app.run(debug=True)