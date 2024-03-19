use libc::{ftruncate, memcpy, mmap, shm_open};
use libc::{MAP_SHARED, O_RDWR, O_CREAT, PROT_WRITE, S_IRUSR, S_IWUSR};
use libc::{c_char, c_void, off_t, size_t};
use std::{ptr};
use std::thread::sleep;
use std::time::Duration;

const STORAGE_ID: *const c_char = b"ISITFAST\0".as_ptr() as *const c_char;
const STORAGE_SIZE: size_t = 10;
const DEFAULT_CONST: u8 = 0;

unsafe fn ipc() {
    let null = ptr::null_mut();
    let fd   = shm_open(STORAGE_ID, O_RDWR | O_CREAT, (S_IRUSR | S_IWUSR) as size_t);

    ftruncate(fd, STORAGE_SIZE as off_t);

    let mut data = [0_u8; STORAGE_SIZE];
    let pointer = data.as_mut_ptr() as *mut c_void;
    let address = mmap(null, STORAGE_SIZE, PROT_WRITE, MAP_SHARED, fd, 0);

    // copy data from "data" to shared memory
    memcpy(address, pointer, STORAGE_SIZE);

    loop {
        // load data from shared memory to "data"
        memcpy(pointer, address, STORAGE_SIZE);

        let current = data[0];

        // I should process incoming data
        if current != DEFAULT_CONST {
            println!("process {:?}", data);
            break;
        }

        sleep(Duration::from_millis(1));
    }
}

fn main() {
    unsafe {
        ipc();
    }
}
