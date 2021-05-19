import React from 'react'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'

export default function PrependInput(props) {
  return (
    <InputGroup className="mb-3">
      <InputGroup.Prepend>
        <InputGroup.Text id="basic-addon1">{props.prependText}</InputGroup.Text>
      </InputGroup.Prepend>
      <FormControl
        ref={props.inputRef}
        aria-label={props.prependText}
        aria-describedby="basic-addon1"
      />
    </InputGroup>
  )
}
