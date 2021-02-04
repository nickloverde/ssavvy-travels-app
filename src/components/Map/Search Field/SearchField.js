import React, { useEffect, useState, useContext } from 'react'
import { connect } from 'react-redux'
import { newSearch } from '../../../Redux/searchReducer'
import { withRouter } from 'react-router-dom'
import { Context } from '../../../context/context'
import AsyncSelect from 'react-select/async'
import allAirports from '../../airports.json'
import './searchField.css'

//Functions used to filter through the airport results
//First we grab all the airports from the data.json file and map them to a new variable
const options = allAirports.map(airport => { return { value: airport.code, label: `${airport.code}-${airport.name}-${airport.city}` } })

//We are then able to filter through these results only loading the specified airports saving rendering time. 
const filterAirports = (inputValue) => {
    return options.filter(i => i.label.toLowerCase().includes(inputValue.toLowerCase()))
}
//This is the 'asynchronous' function that sets the loading. 
const loadOptions = (inputValue, cb) => {
    setTimeout(() => {
        cb(filterAirports(inputValue))
    }, 1000)
}

//Styles
const customStyles = {
    option: (provided, state) => ({
        ...provided,
        fontFamily: 'Montserrat',
        fontWeight: 200
    }),
    container: (provided) => ({
        ...provided,
        width: 'inherit',
        margin: 0,
        marginBottom: '1rem',
        color: '#000'
    }),
    menu: (provided) => ({
        ...provided,
        margin: 0,
    }),
    control: (provided) => ({
        ...provided,
        position: 'relative',
        zIndex: 10000,
        border: '1px solid #767776',
        margin: 0,
        height: '2rem',
        borderRadius: 3,
        backgroundColor: '#fcfffd',
        display: 'flex',
        color: '#fcfffd'
    }),
    singleValue: (provided, state) => {
        const opacity = state.isDisabled ? 0.5 : 1
        const transition = 'opacity 300ms'
        return { ...provided, opacity, transition }
    }
}


const SearchField = (props) => {
    //Details Filter//
    const [round, setRound] = useState(true)
    //Search Fields//
    const [budget, setBudget] = useState(props.budget)
    const [location, setLocation] = useState(props.location)
    const [departureDate, setDepartureDate] = useState(props.departureDate)
    const [arrivalDate, setArrivalDate] = useState(props.returnDate)

    //Airport Filter//
    const [input, setInput] = useState('')
    const [preferred, setPreferred] = useState('')
    const [myAirportsFiltered, setMyAirportsFiltered] = useState([])

    const context = useContext(Context)

    function handleInputChange(newValue) {
        const inputValue = newValue.replace(/\W/g, '')
        setInput(inputValue)
    }

    function searchUpdate() {
        props.newSearch({ budget, location, departureDate, arrivalDate })
    }

    const myAirports = context.airports.map(airport => {
        let airportId = allAirports.findIndex(ap => ap.code == airport.iata)
        return { ...airport, ...allAirports[airportId] }
    })
    console.log(myAirports)

    useEffect(() => {
        myAirports.forEach(airport => {
            allAirports.forEach(ap => {
                if (ap.code === airport.code) {
                    setMyAirportsFiltered(previousState => [...previousState, airport])
                }
            }
            )
        })
    }, [])

    const myOptions = myAirportsFiltered.map(airport => { return { value: airport.iata, label: `${airport.name} ${airport.iata}-${airport.city}` } })

    return (
        <form className='search-fields'>

            <input onChange={(e) => setBudget(e.target.value)}
                className='map-budget-input'
                value={budget}
                type='text'
                placeholder='Whats Your Budget?' />
            <AsyncSelect
                onChange={(e) => !e ? null : setPreferred(e.value)}
                className='airport-select'
                loadOptions={loadOptions}
                isClearable={true}
                onInputChange={handleInputChange}
                placeholder={'Select departure airport...'}
                styles={customStyles}
                theme={theme => ({ ...theme, colors: { ...theme.colors, primary25: '#cae00d', primary: '#cae00d', color: '#000' } })}
                defaultValue={myOptions[0]}
                defaultOptions={input ? input : myOptions} />
            <div className='when-map-inputs'>
                <input onChange={(e) => setDepartureDate(e.target.value)}
                    value={departureDate}
                    id='depart-date-input'
                    type='Date'
                    placeholder='When' />
                <div className='vert-line'></div>
                <input onChange={(e) => setArrivalDate(e.target.value)}
                    value={arrivalDate}
                    id='arrive-date-input'
                    type='Date'
                    placeholder='When' />
            </div>
            <div className='flight-details'>
                <div className='round-oneWay'>
                    {round ? <p>round</p> : <p>one way</p>}
                    <div className='slide-bar'>
                        <div onClick={() => setRound(!round)} 
                        className={round ? 'slider-ball-left' : 'slider-ball-right'}></div>
                    </div>
                </div>
                <div className='round-oneWay'>
                    <p>direct</p>
                    <input type='checkbox' />
                </div>
                <div className='round-oneWay'>
                    <p>passengers</p>
                    <input type='number' min='1' max='10' />
                </div>
            </div>
            <button onClick={() => searchUpdate()}>Search</button>
        </form >
    )
}

function mapStateToProps(reduxState) {
    return {
        budget: reduxState.searchReducer.budget,
        location: reduxState.searchReducer.location,
        departureDate: reduxState.searchReducer.departureDate,
        returnDate: reduxState.searchReducer.returnDate
    }
}

export default withRouter(connect(mapStateToProps, { newSearch })(SearchField))