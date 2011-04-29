class TweetController < ApplicationController
  before_filter :authenticate_user!

  def home
    @tweets = Tweet.no_room.timeline
  end

  def user
    user = User.where(:screen_name => params[:user]).first
    redirect_to :root unless user

    @tweets = Tweet.user(user).timeline
  end

  def create
    tweet = Tweet.create(:body => params[:body], :user => current_user, :room_id => params[:room_id])

    # Room
    if params[:body] =~ /(?:\s+|^)&(\w+)(?:\s+|$)/
      Room.where(:name => $~[1]).first or Room.create(:name => $~[1], :user => current_user)
    end

    # HashTag
    if params[:body] =~ /(?:\s+|^)#(\w+)(?:\s+|$)/
      hash = HashTag.where(:name => $~[1]).first || HashTag.create(:name => $~[1])
      HashTagTweet.create(:hash_tag_id => hash.id, :tweet_id => tweet.id)
    end

    redirect_to request.referer
  end

end
