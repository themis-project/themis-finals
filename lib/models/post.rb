require 'data_mapper'


module Themis
    module Models
        class Post
            include DataMapper::Resource

            property :id, Serial
            property :title, String, length: 100, required: true
            property :description, Text, required: true
            property :created_at, DateTime, required: true
            property :updated_at, DateTime, required: true
        end
    end
end
