import { useState } from 'react'
import { useCookies } from 'react-cookie'
import Modal from './Modal'
import { MDBBtn,MDBIcon } from 'mdb-react-ui-kit'

const ListHeader = ({ listName, getData }) => {
  const [showModal, setShowModal] = useState(null)
  const [, , removeCookie] = useCookies(['user'])

  const signOut = () => {
    removeCookie("AuthToken")
    removeCookie("Email")
    window.location.reload()
  }
  return (
    <li className="list-header">
      <div className="d-flex flex-row mb-3">
      <div className="d-flex p-2"><h2>{listName}</h2></div>
      </div>
      <div className="d-flex flex-row" style={{height: '30px'}}>
        <MDBBtn className='p-1 mr-2' color='success' onClick={() => setShowModal(true)}>
          Stwórz zadanie
        </MDBBtn>
        <MDBBtn className='p-1' style={{ backgroundColor: '#c61118', marginLeft: '10px' }} onClick={signOut}>
        <MDBIcon fas icon="sign-out-alt" /> Wyloguj
        </MDBBtn>
      </div>
      {showModal && (
        <Modal mode={'create'} setShowModal={setShowModal} getData={getData} />
      )}
    </li>
  )
}

export default ListHeader