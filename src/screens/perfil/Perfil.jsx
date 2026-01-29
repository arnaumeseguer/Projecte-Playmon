import './Perfil.css'
import SideBar from '../../../components/SideBar'
import profileLogo from '../../assets/aura.png'

function Perfil() {
  return (
    <>
      <div>
        <h1>Gestionar compte</h1>
        <img src={profileLogo} className="w-md rounded-xl" alt="Foto de perfil" />

        <div>
          <h2>Nom d'usuari</h2> {/* Aquí s'hauria d'inserir el nom d'usuari dinàmicament */}
          <p>Correu electrònic</p> {/* Aquí s'hauria d'inserir el correu electrònic dinàmicament */}
          <button>Editar perfil</button> {/* Botó per editar el perfil */}
        </div>
        <SideBar />
      </div>
    </>
  )
}

export default Perfil