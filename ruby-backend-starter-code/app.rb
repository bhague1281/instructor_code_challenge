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
  file = contents && contents.length >= 2 ? JSON.parse(contents) : JSON.parse('{"data": []}')
  unless params[:name] && params[:oid]
    return 'Invalid Request'
  end
  movie = { name: params[:name], oid: params[:oid] }
  file['data'].push(movie)
  File.write('data.json', JSON.pretty_generate(file))
  movie.to_json
end
