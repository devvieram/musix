# musix
**musix** is a console-based app that allows users to quickly grab lyrics (and metadata) from **Musixmatch** and turns it into a **Just Dance** friendly format!

the tool takes advantage of **Musixmatch's** API to provide **Just Dance** modders easier access to a large library of songs & data. 

## how to use musix?

to start using **musix**, download the app [here](https://github.com/devvieram/musix/releases).
extract the app, and inside the root directory run the following command:

    npm i
and once all needed modules are installed, you can run the app by using:

    npm start
to use the different options **musix** offers, check the documentation:
 - [synced lyrics](https://github.com/devvieram/musix/blob/current/docs/synced_lyrics.md)
 - [lrc lyrics](https://github.com/devvieram/musix/blob/current/docs/lrc_lyrics.md)
 - [song metadata](https://github.com/devvieram/musix/blob/current/docs/metadata.md)

## faq
### why Musixmatch and not another platform like Genius?
**Musixmatch** is the largest music data company and platform that allows users to search and share song lyrics.
streaming platforms such as *Spotify* and *Apple Music* utilize **Musixmatch's** services to provide users with the best content.

(most, if not all) lyrics from **Musixmatch** are made to be synced with the song, whereas **Genius** lyrics are not.
 
## disclaimer
make sure you're using the original song file (by matching the length of the song) in order to achieve the best results. **musix** does not rip music for you.
not all songs will be available (especially newest/unreleased songs), nor will they have all the options available right away. the tool relies on the **Musixmatch's** community's support.

if you wanna contribute for **musix**, i suggest you look into [contributing in **Musixmatch**'s community](https://support.musixmatch.com/category/386-how-to-contribute), you'll also be contributing for many other platforms. :)

**musix** was made possible thanks to [**Musixmatch**](https://developer.musixmatch.com/documentation/api-methods).
**musix** does not intend any copyright infringement.