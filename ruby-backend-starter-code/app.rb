require 'sinatra'
require 'json'

get '/' do
  send_file 'views/index.html'
end

get '/favorites' do
  content_type :json
  return File.read('data.json')
end

get '/favorites/add' do
  contents = File.read('data.json')
  # check if contents are in the file and initialize file accordingly
  if (contents && contents.length >= 2)
    file = JSON.parse(contents)
  else
    file = JSON.parse('{"data": []}')
  end
  # if params not available, signal that this request is invalid
  unless params[:name] && params[:oid]
    return 'Invalid Request'
  end
  movie = { name: params[:name], oid: params[:oid] }
  file['data'].push(movie)
  File.write('data.json', JSON.pretty_generate(file))
  movie.to_json
end
