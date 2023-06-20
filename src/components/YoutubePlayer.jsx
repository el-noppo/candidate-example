import ReactPlayer from "react-player";
import "../styles/modal.scss";

/**
 * Renders a YouTube video player inside a modal and handles the close event.
 *
 * @param {Object} props - The props object
 * @param {string} props.videoKey - The key of the video to show
 * @param {function} props.setOpen - A function to handle the open state of the modal
 * @return {JSX.Element} YoutubePlayer component
 */
const YoutubePlayer = ({ videoKey, setOpen }) => (
  <div className="modal">
    <div className="modal-content">
      <button className="modal-close" onClick={() => setOpen(false)}>
        Close modal
      </button>
      {videoKey ? (
        <ReactPlayer
          className="video-player"
          url={`https://www.youtube.com/watch?v=${videoKey}`}
          controls={true}
          playing={true}
          data-testid="youtube-player"
        />
      ) : (
        <div className="modal-content--no-trailer">
          <h6>no trailer available. Try another movie</h6>
        </div>
      )}
    </div>
  </div>
);

export default YoutubePlayer;
