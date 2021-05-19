import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { homesRef, store } from '../../utils/Firebase'
import { motion } from 'framer-motion'
import Carousel from 'react-bootstrap/Carousel'

export default function BeerCarousel(props) {
  const [homes, setHomes] = useState([])

  // Pass useEffect empty array so it only runs once.
  useEffect(() => {
    // 'on' will fetch updates realtime
    homesRef.on('value', (snapshot) => {
      let tmpHomes = []
      snapshot.forEach((home) => {
        let tmpProperty = home.val()
        tmpProperty.key = home.key
        tmpHomes.push(tmpProperty)
      })
      setHomes(tmpHomes)
    })
  }, [])

  return (
    <Carousel>
      {props.gallery.map((item, index) => {
        return (
          <Carousel.Item key={index} interval={10000}>
            <img className="d-block w-100" src={item} alt="First slide" />
            {props.text === 'true' && (
              <Carousel.Caption>
                <Link to={{ pathname: `/p/${item.key}` }}>
                  <h3 className="underline-trigger">
                    {item.streetAddress}
                    <div className="underline"></div>
                  </h3>
                </Link>
                <p>{item.text}</p>
              </Carousel.Caption>
            )}
          </Carousel.Item>
        )
      })}
    </Carousel>
  )
}
