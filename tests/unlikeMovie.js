import LikeButtonInitiator from "../src/scripts/utils/like-button-initiator"; // Mengimpor modul untuk menginisialisasi tombol "like"
import FavoriteMovieIdb from "../src/scripts/data/favorite-movie-idb"; // Mengimpor modul untuk berinteraksi dengan database film yang disukai

// Deskripsi untuk pengujian fitur "unlike" pada film
describe("Unliking A Movie", () => {
  // Fungsi untuk menambahkan kontainer tombol "like" ke dalam DOM
  const addLikeButtonContainer = () => {
    // Mengatur innerHTML dari body dokumen untuk menyertakan div dengan ID 'likeButtonContainer'
    // Ini akan menjadi tempat di mana tombol "like" dan "unlike" akan dirender
    document.body.innerHTML = '<div id="likeButtonContainer"></div>';
  };

  // Sebelum setiap pengujian dijalankan, fungsi ini akan dipanggil
  beforeEach(async () => {
    // Menyiapkan kontainer tombol "like"
    addLikeButtonContainer();
    // Menambahkan film dengan ID 1 ke dalam daftar film yang disukai
    await FavoriteMovieIdb.putMovie({ id: 1 });
  });

  // Setelah setiap pengujian selesai, fungsi ini akan dipanggil
  afterEach(async () => {
    // Menghapus film dengan ID 1 dari database setelah pengujian
    await FavoriteMovieIdb.deleteMovie(1);
  });

  // Pengujian untuk memastikan widget "unlike" ditampilkan ketika film telah disukai
  it("should display unlike widget when the movie has been liked", async () => {
    // Menginisialisasi tombol "like" dengan kontainer dan informasi film
    await LikeButtonInitiator.init({
      likeButtonContainer: document.querySelector("#likeButtonContainer"), // Mengambil elemen kontainer
      movie: {
        id: 1, // ID film yang akan diuji
      },
    });

    // Memastikan bahwa tombol "unlike" ditampilkan di dalam DOM
    expect(
      document.querySelector('[aria-label="unlike this movie"]')
    ).toBeTruthy(); // Mengharapkan tombol "unlike" ada
  });

  // Pengujian untuk memastikan widget "like" tidak ditampilkan ketika film telah disukai
  it("should not display like widget when the movie has been liked", async () => {
    // Menginisialisasi tombol "like" dengan kontainer dan informasi film
    await LikeButtonInitiator.init({
      likeButtonContainer: document.querySelector("#likeButtonContainer"), // Mengambil elemen kontainer
      movie: {
        id: 1, // ID film yang akan diuji
      },
    });

    // Memastikan bahwa tombol "like" tidak ditampilkan di dalam DOM
    expect(
      document.querySelector('[aria-label="like this movie"]')
    ).toBeFalsy(); // Mengharapkan tombol "like" tidak ada
  });

  // Pengujian untuk memastikan film yang disukai dapat dihapus dari daftar
  it("should be able to remove liked movie from the list", async () => {
    // Menginisialisasi tombol "like" dengan kontainer dan informasi film
    await LikeButtonInitiator.init({
      likeButtonContainer: document.querySelector("#likeButtonContainer"), // Mengambil elemen kontainer
      movie: {
        id: 1, // ID film yang akan diuji
      },
    });

    // Simulasikan pengguna menekan tombol "unlike" untuk menghapus film dari daftar
    document
      .querySelector('[aria-label="unlike this movie"]')
      .dispatchEvent(new Event("click")); // Mengirimkan event klik pada tombol "unlike"

    // Memastikan bahwa daftar film yang disukai sekarang kosong
    expect(await FavoriteMovieIdb.getAllMovies()).toEqual([]); // Mengharapkan tidak ada film yang tersisa
  });

  // Pengujian untuk memastikan tidak ada error ketika pengguna mengklik tombol "unlike" jika film tidak ada di daftar
  it("should not throw error when user click unlike widget if the unliked movie is not in the list", async () => {
    // Menginisialisasi tombol "like" dengan kontainer dan informasi film
    await LikeButtonInitiator.init({
      likeButtonContainer: document.querySelector("#likeButtonContainer"), // Mengambil elemen kontainer
      movie: {
        id: 1, // ID film yang akan diuji
      },
    });

    // Hapus dulu film dari daftar film yang disukai
    await FavoriteMovieIdb.deleteMovie(1); // Menghapus film dengan ID 1 dari database

    // Simulasikan pengguna menekan tombol "unlike" untuk film yang sudah dihapus
    document
      .querySelector('[aria-label="unlike this movie"]')
      .dispatchEvent(new Event("click")); // Mengirimkan event klik pada tombol "unlike"

    // Memastikan bahwa daftar film yang disukai tetap kosong
    expect(await FavoriteMovieIdb.getAllMovies()).toEqual([]); // Mengharapkan tidak ada film yang tersisa
  });
});
