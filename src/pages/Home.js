export default function Home() {
    return (
        <div className="home-container">
            <div className="home-container-tldr">
                <h3 className="home-container-title">What is MovieList?</h3>
                <p className="home-container-tldr">
                    A way to track, rate and build a personalized profile for your Movie viewing history. Plus be
                    notified
                    if any of your favourite movies are showing in a cinema near you.
                </p>
            </div>

            <div className="home-container-content">
                <h4 className="home-container-sub-title">What can it do and why use it?</h4>
                <p>
                    MovieList is your personalized movie catalog, designed to help you track and rediscover
                    all the films you've ever watched, while also offering tailored recommendations and alerts for
                    upcoming
                    cinema screenings of your favorites. Whether you're a casual moviegoer or a film buff, MovieList
                    transforms the way you keep track of your viewing history.
                </p>
                <p>
                    We’ve all been there. Someone asks, "Have you watched any good movies lately?" or "What are your
                    all-time favorite films?" and suddenly, you draw a blank. As a movie lover, I found myself
                    struggling to
                    remember some of the lesser-known films I adored. It felt like I needed a personal
                    rolodex of my entertainment history—a place to store every movie I’ve seen and what I thought
                    about them. MovieList was born to solve that problem.
                </p>
                <p>
                    Another frustration I faced was missing the chance to watch my favorite films in the cinema. Whether
                    I
                    missed the original release, or it was a timeless classic, finding these movies back on the big
                    screen
                    was a challenge. I noticed that cinemas occasionally feature old classics, but I couldn’t keep track
                    of
                    when and where they were showing. MovieList fixes that too!
                </p>
            </div>

            <div className="home-container-features">
                <h4 className="home-container-sub-title">Features:</h4>
                <ul>
                    <li>Track every movie you've ever watched.</li>
                    <li>Rate them based on how much you enjoyed them.</li>
                    <li>Build a viewing profile to easily identify your favourite type of films.</li>
                    <li>Automatically monitor local cinema showtimes for you.</li>
                    <li>Send you a notification if one of your top movies is about to hit the screen—no need to manually
                        check websites anymore.
                    </li>
                </ul>
            </div>
        </div>
    );
}
