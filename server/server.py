from flask import Flask, make_response, jsonify, request
from os.path import join
from tqdm import tqdm
import os
from PIL import Image
from flask_cors import CORS
import io
import base64
import re
import uuid
import errno
import  requests as req
import time
import math
from io import BytesIO
import random
from multiprocessing import Process, cpu_count, Pool
import multiprocessing
from functools import partial


app = Flask(__name__)
app.config['SECRET'] = 'development key'
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
pathCur = os.path.dirname(os.path.abspath(__file__))



def makeDir(dirName):
    try:
        os.makedirs(dirName)
    except OSError as e:
        if e.errno != errno.EEXIST:
            print()


out = join(pathCur, 'output/')
makeDir(out)

@app.route('/api/image',methods=['GET','POST'])
def get_image():

    # print(bytes(request.get_data()))
    image_data = re.sub('^data:image/.+;base64,', '', request.get_data(as_text=True))

    image = Image.open(io.BytesIO(base64.b64decode(image_data))).convert('RGB')
    uuid_str = str(uuid.uuid1())
    image.save(join(out, uuid_str + '.png'))


    res = make_response(jsonify({"image_id": uuid_str}))

    res.headers['Access-Control-Allow-Origin'] = "*"
    res.headers['Access-Control-Allow-Headers'] = "Origin, X-Requested-With, Content-Type, Accept"
    return res


#
# @app.route('/<path:path>')
# def serve(path):
# 	if path != '' and 'output' in path:
# 		path = path.split('/')[-1]
# 		return send_from_directory(out, path)
# 	if path != "" and os.path.exists(join(pathFolder, path)):
# 		return send_from_directory(pathFolder, path)
#
# 	else:
# 		return send_from_directory(pathFolder, 'index.html')
#
#
#
#






def song_images(headers, playlist_id, closest_val):
    api_playlist = 'https://api.spotify.com/v1/playlists/{id}'
    api_playlist_creamy = api_playlist.format(id=playlist_id)
    res_creamy = req.get(api_playlist_creamy, headers=headers)
    res_dict = res_creamy.json()

    if res_creamy.status_code == 401:

        return None

    tracks_urls = []
    album_tracks = set()

    total = res_dict['tracks']['total']
    offset = res_dict['tracks']['offset']
    limit = res_dict['tracks']['limit']
    res_dict =  res_dict['tracks']
    print("Getting Songs")
    while total >  (limit*(offset)):



        for track in res_dict['items']:
            id_track = track['track']['album']['id']
            #         print(track)
            if id_track not in album_tracks:
                use_image = {}
                for image in track['track']['album']['images']:
                    use_image[int(image['width'])] = image['url']
                if len(use_image.keys()) != 0:
                    keys = list(use_image.keys())
                    # print(keys)
                    cl_w = min([k for k in keys if k > closest_val])
                    # print(cl_w, closest_val)
                    tracks_urls.append(use_image[cl_w])

                    album_tracks.add(id_track)
                else:
                    continue
            else:
                continue


        offset +=1
        time.sleep(0.5)
        next_val = res_dict['next']

        if next_val == None:
            break
        res_playlist_next = req.get(next_val, headers=headers)
        res_dict = res_playlist_next.json()


    return tracks_urls

def average_color(img):

    h = img.histogram()

    r = h[0:256]
    g = h[256:512]
    b = h[512:768]

    def wavg(s):

        weighted = sum(i*w for i, w in enumerate(s))


        total = sum(s)
        if total == 0:
            return 0
        return int(weighted / float(total))


    return (wavg(r), wavg(g), wavg(b))

def distance(c1, c2):
    (r1,g1,b1) = c1
    (r2,g2,b2) = c2
    return math.sqrt((r1 - r2)**2 + (g1 - g2) ** 2 + (b1 - b2) **2)



def layer_color(img=None, color=None):
    color_new = Image.new('RGB', img.size, color=color)
    img_blend = Image.blend(color_new, img, 0.12)
    return  img_blend

def random_color(img, color_map):

    in_color_map = True
    color = None
    while in_color_map and color == None:
        color = random.randint(0,255), random.randint(0,255), random.randint(0,255)
        if not color in color_map:
            in_color_map = False

    img_blend = layer_color(img=img, color=color)

    return color, img_blend



def iter_urls(tracks_urls=[], color_map=None, pixel_max=None, trueColor=False, process=0):


    for ind, url in enumerate(tracks_urls):
        response = req.get(url)

        img1 = Image.open(BytesIO(response.content)).convert('RGB')
        img1 = img1.resize((pixel_max,pixel_max), Image.ANTIALIAS)
        if not trueColor:
            avg_color = average_color(img1)
            color_map[avg_color] = img1
        #     print(avg_color)
        else:
            color_map[ind+process] = img1



def pool_process_album_covers(tracks_urls = [], color_map=None, pixel_max=64, trueColor=True, workers=1, pool_number=0):
    url_iter = tracks_urls[pool_number: pool_number+workers]
    iter_urls(tracks_urls=url_iter, color_map=color_map, pixel_max=pixel_max, trueColor=trueColor, process=pool_number)


def get_map_colors(tracks_urls, trueColor=False, pixel_max=64):

    color_map = {}

    print("Getting Colors of thumbnails")

    workers = max(cpu_count(), 1)
    pool = Pool(workers)
    range_pool = list(range(0, len(tracks_urls), workers))
    manager = multiprocessing.Manager()
    return_dict = manager.dict()
    pool_process_partial = partial(pool_process_album_covers, tracks_urls, return_dict, pixel_max, trueColor, workers)
    pool.map(pool_process_partial, range_pool)

    pool.close()
    pool.join()


    number_colors = len(list(return_dict.keys()))

    if not trueColor and number_colors < 10:
        for i in range(30):

            img_new_in = random.randint(0, len(return_dict.keys()))
            key_img = list(return_dict.keys())[img_new_in]
            img_new = return_dict[key_img].copy()

            color_new, img_blend = random_color(img_new, color_map=color_map)

            return_dict[color_new] = img_blend

    # print(color_map)
    return  return_dict


# def mosaic_image(img=None, color_map=None, tiles=80, trueColor=False, pixel_max=64):
#
# 	val_tile = math.ceil(min(img.size) /  tiles)
# 	tile_width = val_tile
# 	if tile_width > pixel_max:
# 		tile_width= pixel_max
# 		val_tile = pixel_max
# 	tile_height = tile_width
# 	currenty = 0
# 	currentx = 0
# 	while currenty < img.size[1]:
# 		resize = False
#
# 		if (currenty + tile_height) > img.size[1]:
# 			resize = True
# 			tile_height = img.size[1] - currenty
# 		while currentx < img.size[0]:
# 			if (currentx + tile_width) > img.size[0]:
# 				resize = True
#
#
# 			tile = img.crop((currentx,currenty,currentx + tile_width,
# 							 currenty + tile_height))
#
# 			color_avg = average_color(tile)
# 			code = None
# 			if trueColor:
# 				img_cover = color_map[random.randint(0, len(color_map.keys())-1)]
# 				code = layer_color(img=img_cover, color=color_avg)
# 				if not resize:
# 					code.thumbnail((tile_width, tile_height), Image.ANTIALIAS)
# 				else:
# 					code = code.resize(tile.size)
#
# 				code.thumbnail((tile_width, tile_height), Image.ANTIALIAS)
#
#
# 				paste_box = (
# 					currentx,
# 					currenty,
# 					currentx+tile_width,
# 					currenty+tile_height
#
# 				)
#
# 				img.paste(code, paste_box)
#
# 			else:
#
# 				colors = list(color_map.keys())
# 				closest_colors = sorted(colors, key=lambda color: distance(color, color_avg))
# 				closest_color = closest_colors[0]
# 				code = color_map[closest_color]
# 				if not resize:
# 					code.thumbnail((tile_width, tile_height), Image.ANTIALIAS)
# 				else:
# 					code = code.resize(tile.size)
# 				# print(code.size)
# 				paste_box = (
# 					currentx,
# 					currenty,
# 					currentx+tile_width,
# 					currenty+tile_height
#
# 				)
#
# 				img.paste(code, paste_box)
# 			currentx += tile_width
#
#
# 		currentx = 0
# 		currenty += tile_height
# 		tile_width = val_tile
#
# 	#         display(tile)
# 			#         display(code)
#
#
# 	return  img



def thread_width(img=None, color_map=None,val_tile=0, trueColor=False, tile_height=0, tile_width=0, currenty=0, resize=False, return_dict=None, valDict=0):

    for currentx in range(0, img.size[0], val_tile):
        if (currentx + tile_width) > img.size[0]:
            resize = True
            tile_width = img.size[0] - currentx
        tile = img.crop((currentx,currenty,currentx + tile_width,
                         currenty + tile_height))


        color_avg = average_color(tile)
        code = None

        if trueColor:
            img_cover = color_map[random.randint(0, len(color_map.keys())-1)]
            code = layer_color(img=img_cover, color=color_avg)
            if not resize:
                code.thumbnail((tile_width, tile_height), Image.ANTIALIAS)
            else:
                code = code.resize(tile.size, Image.ANTIALIAS)
        #
        #
        else:

            colors = None
            colors = list(color_map.keys())
            closest_colors = sorted(colors, key=lambda color: distance(color, color_avg))
            closest_color = closest_colors[0]
            code = color_map[closest_color]
            if not resize:
                code.thumbnail((tile_width, tile_height), Image.ANTIALIAS)
            else:
                code = code.resize(tile.size)


        paste_box = (
            currentx,
            currenty,
            currentx+tile_width,
            currenty+tile_height

        )



        img.paste(code, paste_box)
        currentx += tile_width
        tile.close()


    return_dict[valDict] = img


def get_mosaic_tiles(img,color_map, val_tile, trueColor, tile_height, tile_width, return_dict, process):
    # print("ran process", process)
    for currenty in range((process*val_tile), img.size[1], val_tile):
        resize = False


        if (currenty + tile_height) > img.size[1]:
            resize = True
            tile_height = img.size[1] - currenty
        img_crop = img.crop((0, currenty, img.size[0], currenty+tile_height))
        thread_width(img=img_crop, color_map=color_map, val_tile=val_tile, trueColor=trueColor, tile_height=tile_height, tile_width=tile_width,currenty=0, resize=resize, return_dict=return_dict, valDict=currenty)
        img_crop.close()
    # img_crop.close()
    #         thread_pixel = Process(target=thread_width, args=(img_crop, color_map, trueColor, tile_height, tile_width,0, resize,q,  ))
    # thread_pixel.daemon =True
    #         thread_pixel.start()
    # thread_pixel.start()

def mosaic_image(img=None, color_map=None, tiles=80, trueColor=False, pixel_max=64):
    val_tile = math.ceil(min(img.size) /  tiles)

    workers = max(cpu_count() - 1, 1)
    tile_width = val_tile
    if tile_width > pixel_max:
        tile_width= pixel_max
        val_tile = pixel_max
    tile_height = tile_width

    #     sizeMin, sizeMax = min(img.size), max(img.size)

    #     minWidth = img.size[0] == sizeMin

    threadVals = []

    manager = multiprocessing.Manager()
    return_dict = manager.dict()
    p = Pool(workers)

    # print(workers)
    mosaic_pool_func = partial(get_mosaic_tiles, img, color_map, val_tile, trueColor, tile_height, tile_width, return_dict)


    p.map(mosaic_pool_func, list(range(0, workers)))
    p.close()
    p.join()

    # thread_pixel.close()



    #     for thread in threadVals:
    #         thread.join()

    #     print("done")
    #     display(img)
    #     for currenty in range(0, img.size[1], val_tile):
    #         print('q')
    #         img = q.get()
    #         print('q')


    #
    # [t.start() for t in threadVals]
    # [t.join() for t in threadVals]
    # t.close()
    # Check thread's return value

    for currenty, value in return_dict.items():

        width, height = value.size
        paste_box = (
            0,
            currenty,
            img.size[0],
            currenty+height
        )
        img.paste(value, paste_box)
        value.close()



    [t.close() for t in threadVals]

    return img







@app.route('/api/createmosaic', methods=['GET','POST'])
def create_mosaic():
    base_64_img = request.get_data(as_text=True)

    image_data = re.sub('^data:image/.+;base64,', '', base_64_img)
    img = Image.open(io.BytesIO(base64.b64decode(image_data))).convert('RGB')

    playlist_id = request.args['playlist']
    bearer = request.args['bearer']
    tiles  = request.args['tiles']
    pictureId = request.args['pictureId']
    trueColor = True if request.args['trueColor'].lower() == 'true' else False



    # pictureName = "{}_{}_{}_{}".format(str(pictureId), str(playlist_id),  str(trueColor), str(tiles))



    headers = {
        'Authorization': "Bearer {b}".format(b=bearer)
    }






    print("Getting Color Map")
    pixel_max = min(img.size)

    val_tile = math.ceil((pixel_max) / int( tiles))

    scale_width = val_tile
    if scale_width > pixel_max:
        scale_width= pixel_max

    # print(scale_width)


    song_images_list = song_images(headers, playlist_id, closest_val=scale_width)
    # print(song_images_list[0])
    if song_images_list == None:
        res = make_response(jsonify({"pictureMosaic": False, "error": True}))
        res.headers['Access-Control-Allow-Origin'] = "*"
        res.headers['Access-Control-Allow-Headers'] = "Origin, X-Requested-With, Content-Type, Accept"
        return res
    # print(song_images_list)
    print("Getting Max Pixels")



    color_map = get_map_colors(tracks_urls=song_images_list, trueColor=trueColor, pixel_max=scale_width)

    print("Creating Image")
    new_img = mosaic_image(img=img, color_map=color_map, tiles=int(tiles), trueColor=trueColor, pixel_max=pixel_max).copy()
    data = BytesIO()
    new_img.save(data, "JPEG")



    data64 = base64.b64encode(data.getvalue())
    mosaic_val = u'data:img/jpeg;base64,'+data64.decode('utf-8')

    print("stored new image")
    print("Done with res")
    res = make_response(jsonify({"pictureMosaic": mosaic_val, "error": False}))
    res.headers['Access-Control-Allow-Origin'] = "*"
    res.headers['Access-Control-Allow-Headers'] = "Origin, X-Requested-With, Content-Type, Accept"

    return res


@app.route("/api/rotate")
def rotate():
    picture = request.args['picture']
    path = join(out, picture+'.png')
    img = Image.open(path).convert('RGB')
    new_img = img.rotate(90)
    new_pic = str(uuid.uuid1())
    path_new = join(out, new_pic+'.png')
    new_img.save(path_new)
    os.remove(path)
    res = make_response(jsonify({"picture": new_pic, "error": False}))
    res.headers['Access-Control-Allow-Origin'] = "*"
    res.headers['Access-Control-Allow-Headers'] = "Origin, X-Requested-With, Content-Type, Accept"
    return res




@app.route("/api/")
def test():
    res = make_response(jsonify({"test": "test"}))
    res.headers['Access-Control-Allow-Origin'] = "*"
    res.headers['Access-Control-Allow-Headers'] = "Origin, X-Requested-With, Content-Type, Accept"
    return res



if __name__ == '__main__':
    app.run(app)


