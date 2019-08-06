export default [
  {
    id: 0,
    title: 'The Subtle Art Of Not Giving a Fuck',
    author: 'Mike Manson',
    ISBN: '9780062641540',
    pages: 224,
    rating: 3,
    reviews: [],
    coverURL: 'the-subtle-art-of-not-giving-a-f-ck.jpeg',
    rentalPeriod: 14, // In days

    // This info should be in another object and merged into the book collection when iterating
    renter: 'Olivier De Wit',
    startDate: '2019-08-01',
    rented: true,
  },
  {
    id: 1,
    title: 'Scrum: The Art of Doing Twice the Work in Half the Time',
    author: 'J.J. Sutherland',
    ISBN: '9781847941107',
    pages: 237,
    rating: 4,
    reviews: [],
    coverURL: 'Scrum- The Art of Doing Twice the Work in Half the Time.jpg',
    rentalPeriod: 14, // In days

    // This info should be in another object and merged into the book collection when iterating
    rented: false,
  },
];
