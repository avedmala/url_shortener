# URL Shortener

The app hosted on heroku lets you enter a URL and an optional slug to shorten the URL to. If the slug is taken, you cannot use it. Omitting the slug will make the app generate a random six character long one.

## API Info

**GET** Request to https://url-shortener-av.herokuapp.com/ will serve the static webpage

**GET** Request to https://url-shortener-av.herokuapp.com/<slug> will redirect you to the shortened URL

**POST** Request to https://url-shortener-av.herokuapp.com/url with the body below will create a new document in the database and the app will then redirect you if you visit the url. You can leave the `_id` field blank if you want the app to generate one for you.

```
{
    _id: 'custom slug',
    url: 'url you want to shorten'
}
```

## MongoDB Info

The app connects to a cluster in MongoDB Atlas. The documents in the collection are formatted the same as the body for the **POST** request.
