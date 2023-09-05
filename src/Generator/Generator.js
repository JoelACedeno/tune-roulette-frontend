import React, { useState } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import TuneRouletteApi from '../Api';
import "./Generator.css";

const Generator = () => {
    const [currentRender, setCurrentRender] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [previousResults, setPreviousResults] = useState([]);
    const [dropdownValue, setDropdownValue] = useState("");
    const [selectedButton, setSelectedButton] = useState(null);

    const handleButtonClick = (option) => {
        setSelectedButton(option);
        setSelectedOption(option);
        // console.log("selected option:", selectedOption);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedOption) {
            let data;
            if (selectedOption === 'Album') {
                data = await TuneRouletteApi.getAlbum();
            } else if (selectedOption === 'Track') {
                data = await TuneRouletteApi.getTrack();
            } else if (selectedOption === 'Artist') {
                data = await TuneRouletteApi.getArtist();
            }
            setCurrentRender(data);
            // console.log("data:", data);

            // Update the list of previous results with the new data and selected option
            setPreviousResults((prevResults) => [...prevResults, { data, selectedOption }]);
        }
        setDropdownValue("");
    };

    const handlePreviousResultSelect = (resultIndex) => {
        const selectedResult = previousResults[resultIndex];
        // setSelectedOption(selectedResult.selectedOption);
        setCurrentRender(selectedResult.data);
    };

    return (
        <div className='Generator'>
            <div className='left-panel'>
                <div className='title'>
                    <a href='/'>
                        <h1><b>Tune Roulette</b></h1>
                    </a>
                    <p>Let the music choose you!</p>
                </div>
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Input
                            type="button"
                            value="Track"
                            name="track"
                            id="track-button"
                            className={
                                selectedButton === "Track" ? "btn-selected" : "btn-default"
                            }
                            onClick={() => handleButtonClick("Track")}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Input
                            type="button"
                            value="Album"
                            name="album"
                            id="album-button"
                            className={
                                selectedButton === "Album" ? "btn-selected" : "btn-default"
                            }
                            onClick={() => handleButtonClick("Album")}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Input
                            type="button"
                            value="Artist"
                            name="artist"
                            id="artist-button"
                            className={
                                selectedButton === "Artist" ? "btn-selected" : "btn-default"
                            }
                            onClick={() => handleButtonClick("Artist")}
                        />
                    </FormGroup>
                    <Button className='submit-button' type="submit">Submit!</Button>
                </Form>
            </div>

            <div className='right-panel'>
                {currentRender ? (
                    <div className='results-view'>
                        {/* Display currentRender */}
                        {currentRender.album && (
                            <div>
                                <img src={currentRender.album.image} alt="Album Cover" />
                                <div className='result-bar'>
                                    <p>
                                        <b>{currentRender.album.name} by {currentRender.album.artist}</b>
                                    </p>
                                    <Button className='open-btn'>
                                        <a href={currentRender.album.url} target="_blank" rel="noopener noreferrer">
                                            Listen on Spotify
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        )}
                        {currentRender.track && (
                            <div>
                                <img src={currentRender.track.image} alt="Album Cover" />
                                <div className='result-bar'>
                                    <p>
                                        <b>{currentRender.track.title} by {currentRender.track.artist}</b>
                                    </p>
                                    <Button className='open-btn'>
                                        <a href={currentRender.track.url} target="_blank" rel="noopener noreferrer">
                                            Listen on Spotify
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        )}
                        {currentRender.artist && (
                            <div>
                                <img src={currentRender.artist.image} alt="Album Cover" />
                                <div className='result-bar'>
                                    <h4>
                                        <b>{currentRender.artist.name}</b>
                                    </h4>
                                    <Button className='open-btn'>
                                        <a href={currentRender.artist.url} target="_blank" rel="noopener noreferrer">
                                            Listen on Spotify
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        )}

                        {previousResults && previousResults.length > 0 && (
                            <div className='previousResults-dropdown'>
                                <Label for="previousResult">See a previous result</Label>
                                <Input
                                    type="select"
                                    id="previousResult"
                                    value={dropdownValue}
                                    onChange={(e) => handlePreviousResultSelect(e.target.value)}
                                >
                                    <option value="">Previous results</option>
                                    {previousResults.map((result, index) => (
                                        <option key={index} value={index}>
                                            {/* Display meaningful information from the previous result */}
                                            {`${result.selectedOption}: `}
                                            {result.data.album && `${result.data.album.name} by ${result.data.album.artist}`}
                                            {result.data.track && `${result.data.track.title} by ${result.data.track.artist}`}
                                            {result.data.artist && `${result.data.artist.name}`}
                                        </option>
                                    ))}
                                </Input>
                            </div>
                        )}

                    </div>
                ) : (
                    <div className='welcome-message'>
                        <p>Select an item from the left to get random music to listen to on Spotify!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Generator;
