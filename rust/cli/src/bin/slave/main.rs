use libc::{ftruncate, memcpy, mkdirat, mmap, shm_open};
use libc::{MAP_SHARED, O_RDWR, PROT_WRITE, S_IRUSR, S_IWUSR};
use libc::{c_char, off_t, size_t};
use std::{ptr, str};
use std::ffi::c_void;
use std::thread::sleep;
use std::time::Duration;

const STORAGE_ID: *const c_char = b"ISITFAST\0".as_ptr() as *const c_char;
const STORAGE_SIZE: size_t = 10;
const DEFAULT_CONST: u8 = 1;

fn map_u64_to_data(data: &mut [u8; STORAGE_SIZE], value: u64, offset: usize) {
    let bytes = value.to_le_bytes();

    for i in 0..(STORAGE_SIZE-offset) {
       data[i+offset] = bytes[i];
    }
}

unsafe fn ipc() {
    let null = ptr::null_mut();
    let fd   = shm_open(STORAGE_ID, O_RDWR, (S_IRUSR | S_IWUSR) as size_t);

    ftruncate(fd, STORAGE_SIZE as off_t);

    let x: u32 = 1243442;
    let y = x.to_le_bytes();

    let address = mmap(null, STORAGE_SIZE, PROT_WRITE, MAP_SHARED, fd, 0);

    let mut data  = [0_u8; STORAGE_SIZE];
    let pointer = data.as_mut_ptr() as *mut c_void;

    loop {
        // load data from shared memory to "data"
        memcpy(pointer, address, STORAGE_SIZE);

        let current = data[0];

        // I should run benchmark and mutate "data"
        if current != DEFAULT_CONST {
            sleep(Duration::from_secs(1));

            map_u64_to_data(&mut data, 1234567890u64, 2);

            data[0] = DEFAULT_CONST;
            data[1] = 1; // 1st process

            println!("mutate {:?}", data);

            // copy data from "data" to shared memory
            memcpy(address, pointer, STORAGE_SIZE);
        }

        sleep(Duration::from_millis(1));
    }
}

fn main() {
    unsafe {
        ipc();
    }
}
