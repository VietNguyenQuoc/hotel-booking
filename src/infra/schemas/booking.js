module.exports = {
  createBooking: {
    body: {
      roomTypeId: ['required', 'numeric'],
      quantity: ['required', 'numeric', 'min:1'],
      fromDate: ['required', 'regex:/([12]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))/'],
      toDate: ['required', 'regex:/([12]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))/']
    }
  },
  updateBooking: {
    params: {
      id: ['required', 'numeric']
    },
    body: {
      rooms: [{
        roomTypeId: ['required', 'numeric'],
        quantity: ['required', 'numeric', 'min:1'],
      }],
      fromDate: ['required', 'regex:/([12]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))/'],
      toDate: ['required', 'regex:/([12]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))/']
    }
  },

}