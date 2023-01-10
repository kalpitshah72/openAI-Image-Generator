import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {useState} from 'react'

export default function Home() {


  const [prompt, setPrompt] = useState("")
  const [size, setSize] = useState("medium")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [imageUrl, setImageUrl] = useState("")

  const onSubmitForm = (e: any) => {
    e.preventDefault()
    if(prompt === ''){
      alert('Please add some text')
      return
    }

    generateImageRequest(prompt, size)
  }

  async function generateImageRequest(prompt : string, size: string) {

    try {
      setLoading(true)
      const response = await fetch('http://localhost:5000/openai/generateimage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
          size
        })
      })

      if(!response.ok) {
        setLoading(false)
        throw new Error('That image could not be generated')
      }

      const data = await response.json()

      setImageUrl(data.data)
      setLoading(false)
      
    } catch (error : any) {
      setError(error)
    }
    
  }


  return (
    <>
      <Head>
        <title>Generate Image using OpenAI</title>
        <meta name="description" content="Generate Image using OpenAi" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
      <div className={styles.navbar}>
        <div className={styles.logo}>
          <h2>OpenAI Image Genrator</h2>
        </div>
        <div className={styles["nav-links"]}>
          <ul>
            <li>
              <a href="https://beta.openai.com/docs" target="_blank" rel='noreferrer'
                >OpenAI API Docs</a
              >
            </li>
          </ul>
        </div>
      </div>
    </header>

    <main>
      <section className={styles.showcase}>
        <form id="image-form" onSubmit={onSubmitForm}>
          <h1>Describe An Image</h1>
          <div className={styles["form-control"]}>
            <input type="text" id="prompt" placeholder="Enter Text" 
            className={styles.inputType} onChange={(e) => setPrompt(e.target.value)}/>
          </div>

          <div className={styles["form-control"]}>
            <select name="size" id="size" className={styles.inputType} defaultValue={'medium'}
            onChange={(e) => setSize(e.target.value)}>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
          <button type="submit" className={styles.btn}>Generate</button>
          {loading && <h2 className={styles.msg}>Loading...</h2>}
        </form>
      </section>

      <section className={styles.image}>
        <div className={styles["image-container"]}>
          <h2 className={styles.msg}>{error}</h2>
          <img src={imageUrl} alt="" id="image" className={styles.imageShow} />
        </div>
      </section>
    </main>
    </>
  )
}
