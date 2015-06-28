require 'data_mapper'


module Themis
    module Models
        class Post
            include DataMapper::Resource

            property :id, Serial
            property :content, Text
            property :created_at, DateTime
            property :updated_at, DateTime
        end
    end
end
