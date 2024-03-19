use libc::{ftruncate, memcpy, mmap, shm_open};
use libc::{MAP_SHARED, O_RDWR, O_CREAT, PROT_WRITE, S_IRUSR, S_IWUSR};
use libc::{c_char, c_void, off_t, size_t};
use std::{ptr};
use std::thread::sleep;
use std::time::Duration;

const STORAGE_ID   : *const c_char = b"ISITFAST\0".as_ptr() as *const c_char;
const STORAGE_SIZE : size_t        = 128;

unsafe fn ipc() {
    let null = ptr::null_mut();
    let fd   = shm_open(STORAGE_ID, O_RDWR | O_CREAT, (S_IRUSR | S_IWUSR) as size_t);

    ftruncate(fd, STORAGE_SIZE as off_t);

    let addr = mmap(null, STORAGE_SIZE, PROT_WRITE, MAP_SHARED, fd, 0);

    let mut counter: u32 = 0;

    loop {
        memcpy(addr, ptr::addr_of!(counter) as *const c_void, 32);
        println!("count: {:?}", counter);
        sleep(Duration::from_secs(1));
        counter += 1;
    }

}

fn main() {
    unsafe {
        ipc();
    }
}
