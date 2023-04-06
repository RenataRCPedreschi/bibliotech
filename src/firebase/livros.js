import {
    addDoc,
    deleteDoc,
    doc,
    endBefore,
    getDoc,
    getDocs,
    limit,
    limitToLast,
    orderBy,
    query,
    startAfter,
    updateDoc
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { livrosCollection } from "./collections";
import { storage } from "./config"

export async function addLivro(data) {
    await addDoc(livrosCollection, data);
}

export async function getLivros() {
    const snapshot = await getDocs(livrosCollection);
    let livros = [];
    snapshot.forEach(doc => {
        livros.push({...doc.data(), id: doc.id});
    })
    return livros;
}

export async function getLivro(id) {
    const document = await getDoc(doc(livrosCollection, id));
    return {...document.data(), id: document.id};
}

export async function updateLivro(id, data) {
    await updateDoc(doc(livrosCollection, id), data);
}

export async function deleteLivro(id) {
    await deleteDoc(doc(livrosCollection, id));
}

export async function uploadCapaLivro(imagem) {
    const filename = imagem.name;
    const imageRef = ref(storage, `livros/${filename}`);
    const result = await uploadBytes(imageRef, imagem);
    return await getDownloadURL(result.ref);
}



/* PAGINAÇÃO */
export async function paginaInicial() {
    const primeiraPagina = query(
      livrosCollection,
      orderBy("livros"),
      limit(3)
    );
    const livrosSnapshot = await getDocs(primeiraPagina);
    const livros = [];
  
    livrosSnapshot.forEach((doc) => {
    livros.push({ ...doc.data(), id: doc.id });
    });
  
    return livros;
  }
  
  export async function avancarPagina(lastObject) {
    const proxima = query(
      livrosCollection,
      orderBy("livros"),
      startAfter(lastObject.livros),
      limit(4)
    );
  
    const livrosSnapshot = await getDocs(proxima);
    const livros = [];
    livrosSnapshot.forEach((doc) => {
    livros.push({ ...doc.data(), id: doc.id });
    });
  
    return livros;
  }
  
  export async function voltarPagina(firstObject) {
    const voltar = query(
      livrosCollection,
      orderBy("dataEmprestimo"),
      endBefore(firstObject.dataEmprestimo),
      limitToLast(4)
    );
    const livrosSnapshot = await getDocs(voltar);
    const livros = [];
    livrosSnapshot.forEach((doc) => {
    livros.push({ ...doc.data(), id: doc.id });
    });
    return livros;
  }
  

  
  