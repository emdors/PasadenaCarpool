module.exports = {
  data: { rawdata:
    [ { name: 'Adam',
      email: 'adam@gmail.com',
      numPassengers: '4',
      MondayDriveStatus: 'can',
      notes: 'Ponies are awesome.',
      MondayAMTimes: '530,545,600,',
      MondayPMTimes: '515,530,545,600,615,'},
    { name: 'Bob',
      email: 'Bob@gmail.com',
      numPassengers: '8',
      MondayDriveStatus: 'can',
      notes: 'Dogs are awesome.',
      MondayAMTimes: '1000,1015,1030,1045,',
      MondayPMTimes: '600,615,630,'},
    { name: 'Caroline',
      email: 'carol@ine.org',
      numPassengers: '0',
      MondayDriveStatus: 'can',
      notes: 'Ines are awesome',
      MondayAMTimes: '700,715,730,745,',
      MondayPMTimes: '400,415,430,445,'},
    { name: 'Katie',
      email: 'kt@gmail.com',
      numPassengers: '3',
      MondayDriveStatus: 'can',
      notes: '',
      MondayAMTimes: '545,600,615,630,645,700,715,',
      MondayPMTimes: '515,530,545,600,615,630,'},
    { name: 'Doren',
      email: 'doren@gmail.com',
      numPassengers: '5',
      MondayDriveStatus: 'can',
      notes: '',
      MondayAMTimes: '545,600,615,630,645,',
      MondayPMTimes: '430,445,500,515,530,545,'},
    { name: 'Estrid',
      email: 'estrid@gmail.com',
      numPassengers: '6',
      MondayDriveStatus: 'can',
      notes: '',
      MondayAMTimes: '615,630,645,700,715,730,',
      MondayPMTimes: '530,545,600,615,630,645,'},
    { name: 'Frizzle',
      email: 'frizzle@yahoo.net',
      numPassengers: '2',
      MondayDriveStatus: 'can',
      notes: '',
      MondayAMTimes: '615,630,645,',
      MondayPMTimes: '430,445,500,515,530,545,'},
    { name: 'Guthrie',
      email: 'guth@hotmail.edu',
      numPassengers: '0',
      MondayDriveStatus: 'cannot',
      notes: '',
      MondayAMTimes: '745,800,815,830,845,900,915,930,945,1000,1015,1030,1045,',
      MondayPMTimes: '415,430,445,500,515,'}],
    parseddata:
    [
      {
        "day": "Monday",
        "times": [
          {
            "halfday": "AM",
            "people": [
              {
                "name": "Bob",
                "driveStatus": "can",
                "canGos": [
                  {
                    "time": 500,
                    "canGo": false
                  },
                  {
                    "time": 515,
                    "canGo": false
                  },
                  {
                    "time": 530,
                    "canGo": false
                  },
                  {
                    "time": 545,
                    "canGo": false
                  },
                  {
                    "time": 600,
                    "canGo": false
                  },
                  {
                    "time": 615,
                    "canGo": false
                  },
                  {
                    "time": 630,
                    "canGo": false
                  },
                  {
                    "time": 645,
                    "canGo": false
                  },
                  {
                    "time": 700,
                    "canGo": false
                  },
                  {
                    "time": 715,
                    "canGo": false
                  },
                  {
                    "time": 730,
                    "canGo": false
                  },
                  {
                    "time": 745,
                    "canGo": false
                  },
                  {
                    "time": 800,
                    "canGo": false
                  },
                  {
                    "time": 815,
                    "canGo": false
                  },
                  {
                    "time": 830,
                    "canGo": false
                  },
                  {
                    "time": 845,
                    "canGo": false
                  },
                  {
                    "time": 900,
                    "canGo": false
                  },
                  {
                    "time": 915,
                    "canGo": false
                  },
                  {
                    "time": 930,
                    "canGo": false
                  },
                  {
                    "time": 945,
                    "canGo": false
                  },
                  {
                    "time": 1000,
                    "canGo": true
                  },
                  {
                    "time": 1015,
                    "canGo": true
                  },
                  {
                    "time": 1030,
                    "canGo": true
                  },
                  {
                    "time": 1045,
                    "canGo": true
                  }
                ]
              },
              {
                "name": "Guthrie",
                "driveStatus": "cannot",
                "canGos": [
                  {
                    "time": 500,
                    "canGo": false
                  },
                  {
                    "time": 515,
                    "canGo": false
                  },
                  {
                    "time": 530,
                    "canGo": false
                  },
                  {
                    "time": 545,
                    "canGo": false
                  },
                  {
                    "time": 600,
                    "canGo": false
                  },
                  {
                    "time": 615,
                    "canGo": false
                  },
                  {
                    "time": 630,
                    "canGo": false
                  },
                  {
                    "time": 645,
                    "canGo": false
                  },
                  {
                    "time": 700,
                    "canGo": false
                  },
                  {
                    "time": 715,
                    "canGo": false
                  },
                  {
                    "time": 730,
                    "canGo": false
                  },
                  {
                    "time": 745,
                    "canGo": true
                  },
                  {
                    "time": 800,
                    "canGo": true
                  },
                  {
                    "time": 815,
                    "canGo": true
                  },
                  {
                    "time": 830,
                    "canGo": true
                  },
                  {
                    "time": 845,
                    "canGo": true
                  },
                  {
                    "time": 900,
                    "canGo": true
                  },
                  {
                    "time": 915,
                    "canGo": true
                  },
                  {
                    "time": 930,
                    "canGo": true
                  },
                  {
                    "time": 945,
                    "canGo": true
                  },
                  {
                    "time": 1000,
                    "canGo": true
                  },
                  {
                    "time": 1015,
                    "canGo": true
                  },
                  {
                    "time": 1030,
                    "canGo": true
                  },
                  {
                    "time": 1045,
                    "canGo": true
                  }
                ]
              },
              {
                "name": "Caroline",
                "driveStatus": "can",
                "canGos": [
                  {
                    "time": 500,
                    "canGo": false
                  },
                  {
                    "time": 515,
                    "canGo": false
                  },
                  {
                    "time": 530,
                    "canGo": false
                  },
                  {
                    "time": 545,
                    "canGo": false
                  },
                  {
                    "time": 600,
                    "canGo": false
                  },
                  {
                    "time": 615,
                    "canGo": false
                  },
                  {
                    "time": 630,
                    "canGo": false
                  },
                  {
                    "time": 645,
                    "canGo": false
                  },
                  {
                    "time": 700,
                    "canGo": true
                  },
                  {
                    "time": 715,
                    "canGo": true
                  },
                  {
                    "time": 730,
                    "canGo": true
                  },
                  {
                    "time": 745,
                    "canGo": true
                  },
                  {
                    "time": 800,
                    "canGo": false
                  },
                  {
                    "time": 815,
                    "canGo": false
                  },
                  {
                    "time": 830,
                    "canGo": false
                  },
                  {
                    "time": 845,
                    "canGo": false
                  },
                  {
                    "time": 900,
                    "canGo": false
                  },
                  {
                    "time": 915,
                    "canGo": false
                  },
                  {
                    "time": 930,
                    "canGo": false
                  },
                  {
                    "time": 945,
                    "canGo": false
                  },
                  {
                    "time": 1000,
                    "canGo": false
                  },
                  {
                    "time": 1015,
                    "canGo": false
                  },
                  {
                    "time": 1030,
                    "canGo": false
                  },
                  {
                    "time": 1045,
                    "canGo": false
                  }
                ]
              },
              {
                "name": "Estrid",
                "driveStatus": "can",
                "canGos": [
                  {
                    "time": 500,
                    "canGo": false
                  },
                  {
                    "time": 515,
                    "canGo": false
                  },
                  {
                    "time": 530,
                    "canGo": false
                  },
                  {
                    "time": 545,
                    "canGo": false
                  },
                  {
                    "time": 600,
                    "canGo": false
                  },
                  {
                    "time": 615,
                    "canGo": true
                  },
                  {
                    "time": 630,
                    "canGo": true
                  },
                  {
                    "time": 645,
                    "canGo": true
                  },
                  {
                    "time": 700,
                    "canGo": true
                  },
                  {
                    "time": 715,
                    "canGo": true
                  },
                  {
                    "time": 730,
                    "canGo": true
                  },
                  {
                    "time": 745,
                    "canGo": false
                  },
                  {
                    "time": 800,
                    "canGo": false
                  },
                  {
                    "time": 815,
                    "canGo": false
                  },
                  {
                    "time": 830,
                    "canGo": false
                  },
                  {
                    "time": 845,
                    "canGo": false
                  },
                  {
                    "time": 900,
                    "canGo": false
                  },
                  {
                    "time": 915,
                    "canGo": false
                  },
                  {
                    "time": 930,
                    "canGo": false
                  },
                  {
                    "time": 945,
                    "canGo": false
                  },
                  {
                    "time": 1000,
                    "canGo": false
                  },
                  {
                    "time": 1015,
                    "canGo": false
                  },
                  {
                    "time": 1030,
                    "canGo": false
                  },
                  {
                    "time": 1045,
                    "canGo": false
                  }
                ]
              },
              {
                "name": "Katie",
                "driveStatus": "can",
                "canGos": [
                  {
                    "time": 500,
                    "canGo": false
                  },
                  {
                    "time": 515,
                    "canGo": false
                  },
                  {
                    "time": 530,
                    "canGo": false
                  },
                  {
                    "time": 545,
                    "canGo": true
                  },
                  {
                    "time": 600,
                    "canGo": true
                  },
                  {
                    "time": 615,
                    "canGo": true
                  },
                  {
                    "time": 630,
                    "canGo": true
                  },
                  {
                    "time": 645,
                    "canGo": true
                  },
                  {
                    "time": 700,
                    "canGo": true
                  },
                  {
                    "time": 715,
                    "canGo": true
                  },
                  {
                    "time": 730,
                    "canGo": false
                  },
                  {
                    "time": 745,
                    "canGo": false
                  },
                  {
                    "time": 800,
                    "canGo": false
                  },
                  {
                    "time": 815,
                    "canGo": false
                  },
                  {
                    "time": 830,
                    "canGo": false
                  },
                  {
                    "time": 845,
                    "canGo": false
                  },
                  {
                    "time": 900,
                    "canGo": false
                  },
                  {
                    "time": 915,
                    "canGo": false
                  },
                  {
                    "time": 930,
                    "canGo": false
                  },
                  {
                    "time": 945,
                    "canGo": false
                  },
                  {
                    "time": 1000,
                    "canGo": false
                  },
                  {
                    "time": 1015,
                    "canGo": false
                  },
                  {
                    "time": 1030,
                    "canGo": false
                  },
                  {
                    "time": 1045,
                    "canGo": false
                  }
                ]
              },
              {
                "name": "Doren",
                "driveStatus": "can",
                "canGos": [
                  {
                    "time": 500,
                    "canGo": false
                  },
                  {
                    "time": 515,
                    "canGo": false
                  },
                  {
                    "time": 530,
                    "canGo": false
                  },
                  {
                    "time": 545,
                    "canGo": true
                  },
                  {
                    "time": 600,
                    "canGo": true
                  },
                  {
                    "time": 615,
                    "canGo": true
                  },
                  {
                    "time": 630,
                    "canGo": true
                  },
                  {
                    "time": 645,
                    "canGo": true
                  },
                  {
                    "time": 700,
                    "canGo": false
                  },
                  {
                    "time": 715,
                    "canGo": false
                  },
                  {
                    "time": 730,
                    "canGo": false
                  },
                  {
                    "time": 745,
                    "canGo": false
                  },
                  {
                    "time": 800,
                    "canGo": false
                  },
                  {
                    "time": 815,
                    "canGo": false
                  },
                  {
                    "time": 830,
                    "canGo": false
                  },
                  {
                    "time": 845,
                    "canGo": false
                  },
                  {
                    "time": 900,
                    "canGo": false
                  },
                  {
                    "time": 915,
                    "canGo": false
                  },
                  {
                    "time": 930,
                    "canGo": false
                  },
                  {
                    "time": 945,
                    "canGo": false
                  },
                  {
                    "time": 1000,
                    "canGo": false
                  },
                  {
                    "time": 1015,
                    "canGo": false
                  },
                  {
                    "time": 1030,
                    "canGo": false
                  },
                  {
                    "time": 1045,
                    "canGo": false
                  }
                ]
              },
              {
                "name": "Frizzle",
                "driveStatus": "can",
                "canGos": [
                  {
                    "time": 500,
                    "canGo": false
                  },
                  {
                    "time": 515,
                    "canGo": false
                  },
                  {
                    "time": 530,
                    "canGo": false
                  },
                  {
                    "time": 545,
                    "canGo": false
                  },
                  {
                    "time": 600,
                    "canGo": false
                  },
                  {
                    "time": 615,
                    "canGo": true
                  },
                  {
                    "time": 630,
                    "canGo": true
                  },
                  {
                    "time": 645,
                    "canGo": true
                  },
                  {
                    "time": 700,
                    "canGo": false
                  },
                  {
                    "time": 715,
                    "canGo": false
                  },
                  {
                    "time": 730,
                    "canGo": false
                  },
                  {
                    "time": 745,
                    "canGo": false
                  },
                  {
                    "time": 800,
                    "canGo": false
                  },
                  {
                    "time": 815,
                    "canGo": false
                  },
                  {
                    "time": 830,
                    "canGo": false
                  },
                  {
                    "time": 845,
                    "canGo": false
                  },
                  {
                    "time": 900,
                    "canGo": false
                  },
                  {
                    "time": 915,
                    "canGo": false
                  },
                  {
                    "time": 930,
                    "canGo": false
                  },
                  {
                    "time": 945,
                    "canGo": false
                  },
                  {
                    "time": 1000,
                    "canGo": false
                  },
                  {
                    "time": 1015,
                    "canGo": false
                  },
                  {
                    "time": 1030,
                    "canGo": false
                  },
                  {
                    "time": 1045,
                    "canGo": false
                  }
                ]
              },
              {
                "name": "Adam",
                "driveStatus": "can",
                "canGos": [
                  {
                    "time": 500,
                    "canGo": false
                  },
                  {
                    "time": 515,
                    "canGo": false
                  },
                  {
                    "time": 530,
                    "canGo": true
                  },
                  {
                    "time": 545,
                    "canGo": true
                  },
                  {
                    "time": 600,
                    "canGo": true
                  },
                  {
                    "time": 615,
                    "canGo": false
                  },
                  {
                    "time": 630,
                    "canGo": false
                  },
                  {
                    "time": 645,
                    "canGo": false
                  },
                  {
                    "time": 700,
                    "canGo": false
                  },
                  {
                    "time": 715,
                    "canGo": false
                  },
                  {
                    "time": 730,
                    "canGo": false
                  },
                  {
                    "time": 745,
                    "canGo": false
                  },
                  {
                    "time": 800,
                    "canGo": false
                  },
                  {
                    "time": 815,
                    "canGo": false
                  },
                  {
                    "time": 830,
                    "canGo": false
                  },
                  {
                    "time": 845,
                    "canGo": false
                  },
                  {
                    "time": 900,
                    "canGo": false
                  },
                  {
                    "time": 915,
                    "canGo": false
                  },
                  {
                    "time": 930,
                    "canGo": false
                  },
                  {
                    "time": 945,
                    "canGo": false
                  },
                  {
                    "time": 1000,
                    "canGo": false
                  },
                  {
                    "time": 1015,
                    "canGo": false
                  },
                  {
                    "time": 1030,
                    "canGo": false
                  },
                  {
                    "time": 1045,
                    "canGo": false
                  }
                ]
              }
            ]
          },
          {
            "halfday": "PM",
            "people": [
              {
                "name": "Caroline",
                "driveStatus": "can",
                "canGos": [
                  {
                    "time": 300,
                    "canGo": false
                  },
                  {
                    "time": 315,
                    "canGo": false
                  },
                  {
                    "time": 330,
                    "canGo": false
                  },
                  {
                    "time": 345,
                    "canGo": false
                  },
                  {
                    "time": 400,
                    "canGo": true
                  },
                  {
                    "time": 415,
                    "canGo": true
                  },
                  {
                    "time": 430,
                    "canGo": true
                  },
                  {
                    "time": 445,
                    "canGo": true
                  },
                  {
                    "time": 500,
                    "canGo": false
                  },
                  {
                    "time": 515,
                    "canGo": false
                  },
                  {
                    "time": 530,
                    "canGo": false
                  },
                  {
                    "time": 545,
                    "canGo": false
                  },
                  {
                    "time": 600,
                    "canGo": false
                  },
                  {
                    "time": 615,
                    "canGo": false
                  },
                  {
                    "time": 630,
                    "canGo": false
                  },
                  {
                    "time": 645,
                    "canGo": false
                  },
                  {
                    "time": 700,
                    "canGo": false
                  },
                  {
                    "time": 715,
                    "canGo": false
                  },
                  {
                    "time": 730,
                    "canGo": false
                  },
                  {
                    "time": 745,
                    "canGo": false
                  },
                  {
                    "time": 800,
                    "canGo": false
                  },
                  {
                    "time": 815,
                    "canGo": false
                  },
                  {
                    "time": 830,
                    "canGo": false
                  },
                  {
                    "time": 845,
                    "canGo": false
                  }
                ]
              },
              {
                "name": "Guthrie",
                "driveStatus": "cannot",
                "canGos": [
                  {
                    "time": 300,
                    "canGo": false
                  },
                  {
                    "time": 315,
                    "canGo": false
                  },
                  {
                    "time": 330,
                    "canGo": false
                  },
                  {
                    "time": 345,
                    "canGo": false
                  },
                  {
                    "time": 400,
                    "canGo": false
                  },
                  {
                    "time": 415,
                    "canGo": true
                  },
                  {
                    "time": 430,
                    "canGo": true
                  },
                  {
                    "time": 445,
                    "canGo": true
                  },
                  {
                    "time": 500,
                    "canGo": true
                  },
                  {
                    "time": 515,
                    "canGo": true
                  },
                  {
                    "time": 530,
                    "canGo": false
                  },
                  {
                    "time": 545,
                    "canGo": false
                  },
                  {
                    "time": 600,
                    "canGo": false
                  },
                  {
                    "time": 615,
                    "canGo": false
                  },
                  {
                    "time": 630,
                    "canGo": false
                  },
                  {
                    "time": 645,
                    "canGo": false
                  },
                  {
                    "time": 700,
                    "canGo": false
                  },
                  {
                    "time": 715,
                    "canGo": false
                  },
                  {
                    "time": 730,
                    "canGo": false
                  },
                  {
                    "time": 745,
                    "canGo": false
                  },
                  {
                    "time": 800,
                    "canGo": false
                  },
                  {
                    "time": 815,
                    "canGo": false
                  },
                  {
                    "time": 830,
                    "canGo": false
                  },
                  {
                    "time": 845,
                    "canGo": false
                  }
                ]
              },
              {
                "name": "Doren",
                "driveStatus": "can",
                "canGos": [
                  {
                    "time": 300,
                    "canGo": false
                  },
                  {
                    "time": 315,
                    "canGo": false
                  },
                  {
                    "time": 330,
                    "canGo": false
                  },
                  {
                    "time": 345,
                    "canGo": false
                  },
                  {
                    "time": 400,
                    "canGo": false
                  },
                  {
                    "time": 415,
                    "canGo": false
                  },
                  {
                    "time": 430,
                    "canGo": true
                  },
                  {
                    "time": 445,
                    "canGo": true
                  },
                  {
                    "time": 500,
                    "canGo": true
                  },
                  {
                    "time": 515,
                    "canGo": true
                  },
                  {
                    "time": 530,
                    "canGo": true
                  },
                  {
                    "time": 545,
                    "canGo": true
                  },
                  {
                    "time": 600,
                    "canGo": false
                  },
                  {
                    "time": 615,
                    "canGo": false
                  },
                  {
                    "time": 630,
                    "canGo": false
                  },
                  {
                    "time": 645,
                    "canGo": false
                  },
                  {
                    "time": 700,
                    "canGo": false
                  },
                  {
                    "time": 715,
                    "canGo": false
                  },
                  {
                    "time": 730,
                    "canGo": false
                  },
                  {
                    "time": 745,
                    "canGo": false
                  },
                  {
                    "time": 800,
                    "canGo": false
                  },
                  {
                    "time": 815,
                    "canGo": false
                  },
                  {
                    "time": 830,
                    "canGo": false
                  },
                  {
                    "time": 845,
                    "canGo": false
                  }
                ]
              },
              {
                "name": "Frizzle",
                "driveStatus": "can",
                "canGos": [
                  {
                    "time": 300,
                    "canGo": false
                  },
                  {
                    "time": 315,
                    "canGo": false
                  },
                  {
                    "time": 330,
                    "canGo": false
                  },
                  {
                    "time": 345,
                    "canGo": false
                  },
                  {
                    "time": 400,
                    "canGo": false
                  },
                  {
                    "time": 415,
                    "canGo": false
                  },
                  {
                    "time": 430,
                    "canGo": true
                  },
                  {
                    "time": 445,
                    "canGo": true
                  },
                  {
                    "time": 500,
                    "canGo": true
                  },
                  {
                    "time": 515,
                    "canGo": true
                  },
                  {
                    "time": 530,
                    "canGo": true
                  },
                  {
                    "time": 545,
                    "canGo": true
                  },
                  {
                    "time": 600,
                    "canGo": false
                  },
                  {
                    "time": 615,
                    "canGo": false
                  },
                  {
                    "time": 630,
                    "canGo": false
                  },
                  {
                    "time": 645,
                    "canGo": false
                  },
                  {
                    "time": 700,
                    "canGo": false
                  },
                  {
                    "time": 715,
                    "canGo": false
                  },
                  {
                    "time": 730,
                    "canGo": false
                  },
                  {
                    "time": 745,
                    "canGo": false
                  },
                  {
                    "time": 800,
                    "canGo": false
                  },
                  {
                    "time": 815,
                    "canGo": false
                  },
                  {
                    "time": 830,
                    "canGo": false
                  },
                  {
                    "time": 845,
                    "canGo": false
                  }
                ]
              },
              {
                "name": "Adam",
                "driveStatus": "can",
                "canGos": [
                  {
                    "time": 300,
                    "canGo": false
                  },
                  {
                    "time": 315,
                    "canGo": false
                  },
                  {
                    "time": 330,
                    "canGo": false
                  },
                  {
                    "time": 345,
                    "canGo": false
                  },
                  {
                    "time": 400,
                    "canGo": false
                  },
                  {
                    "time": 415,
                    "canGo": false
                  },
                  {
                    "time": 430,
                    "canGo": false
                  },
                  {
                    "time": 445,
                    "canGo": false
                  },
                  {
                    "time": 500,
                    "canGo": false
                  },
                  {
                    "time": 515,
                    "canGo": true
                  },
                  {
                    "time": 530,
                    "canGo": true
                  },
                  {
                    "time": 545,
                    "canGo": true
                  },
                  {
                    "time": 600,
                    "canGo": true
                  },
                  {
                    "time": 615,
                    "canGo": true
                  },
                  {
                    "time": 630,
                    "canGo": false
                  },
                  {
                    "time": 645,
                    "canGo": false
                  },
                  {
                    "time": 700,
                    "canGo": false
                  },
                  {
                    "time": 715,
                    "canGo": false
                  },
                  {
                    "time": 730,
                    "canGo": false
                  },
                  {
                    "time": 745,
                    "canGo": false
                  },
                  {
                    "time": 800,
                    "canGo": false
                  },
                  {
                    "time": 815,
                    "canGo": false
                  },
                  {
                    "time": 830,
                    "canGo": false
                  },
                  {
                    "time": 845,
                    "canGo": false
                  }
                ]
              },
              {
                "name": "Katie",
                "driveStatus": "can",
                "canGos": [
                  {
                    "time": 300,
                    "canGo": false
                  },
                  {
                    "time": 315,
                    "canGo": false
                  },
                  {
                    "time": 330,
                    "canGo": false
                  },
                  {
                    "time": 345,
                    "canGo": false
                  },
                  {
                    "time": 400,
                    "canGo": false
                  },
                  {
                    "time": 415,
                    "canGo": false
                  },
                  {
                    "time": 430,
                    "canGo": false
                  },
                  {
                    "time": 445,
                    "canGo": false
                  },
                  {
                    "time": 500,
                    "canGo": false
                  },
                  {
                    "time": 515,
                    "canGo": true
                  },
                  {
                    "time": 530,
                    "canGo": true
                  },
                  {
                    "time": 545,
                    "canGo": true
                  },
                  {
                    "time": 600,
                    "canGo": true
                  },
                  {
                    "time": 615,
                    "canGo": true
                  },
                  {
                    "time": 630,
                    "canGo": true
                  },
                  {
                    "time": 645,
                    "canGo": false
                  },
                  {
                    "time": 700,
                    "canGo": false
                  },
                  {
                    "time": 715,
                    "canGo": false
                  },
                  {
                    "time": 730,
                    "canGo": false
                  },
                  {
                    "time": 745,
                    "canGo": false
                  },
                  {
                    "time": 800,
                    "canGo": false
                  },
                  {
                    "time": 815,
                    "canGo": false
                  },
                  {
                    "time": 830,
                    "canGo": false
                  },
                  {
                    "time": 845,
                    "canGo": false
                  }
                ]
              },
              {
                "name": "Estrid",
                "driveStatus": "can",
                "canGos": [
                  {
                    "time": 300,
                    "canGo": false
                  },
                  {
                    "time": 315,
                    "canGo": false
                  },
                  {
                    "time": 330,
                    "canGo": false
                  },
                  {
                    "time": 345,
                    "canGo": false
                  },
                  {
                    "time": 400,
                    "canGo": false
                  },
                  {
                    "time": 415,
                    "canGo": false
                  },
                  {
                    "time": 430,
                    "canGo": false
                  },
                  {
                    "time": 445,
                    "canGo": false
                  },
                  {
                    "time": 500,
                    "canGo": false
                  },
                  {
                    "time": 515,
                    "canGo": false
                  },
                  {
                    "time": 530,
                    "canGo": true
                  },
                  {
                    "time": 545,
                    "canGo": true
                  },
                  {
                    "time": 600,
                    "canGo": true
                  },
                  {
                    "time": 615,
                    "canGo": true
                  },
                  {
                    "time": 630,
                    "canGo": true
                  },
                  {
                    "time": 645,
                    "canGo": true
                  },
                  {
                    "time": 700,
                    "canGo": false
                  },
                  {
                    "time": 715,
                    "canGo": false
                  },
                  {
                    "time": 730,
                    "canGo": false
                  },
                  {
                    "time": 745,
                    "canGo": false
                  },
                  {
                    "time": 800,
                    "canGo": false
                  },
                  {
                    "time": 815,
                    "canGo": false
                  },
                  {
                    "time": 830,
                    "canGo": false
                  },
                  {
                    "time": 845,
                    "canGo": false
                  }
                ]
              },
              {
                "name": "Bob",
                "driveStatus": "can",
                "canGos": [
                  {
                    "time": 300,
                    "canGo": false
                  },
                  {
                    "time": 315,
                    "canGo": false
                  },
                  {
                    "time": 330,
                    "canGo": false
                  },
                  {
                    "time": 345,
                    "canGo": false
                  },
                  {
                    "time": 400,
                    "canGo": false
                  },
                  {
                    "time": 415,
                    "canGo": false
                  },
                  {
                    "time": 430,
                    "canGo": false
                  },
                  {
                    "time": 445,
                    "canGo": false
                  },
                  {
                    "time": 500,
                    "canGo": false
                  },
                  {
                    "time": 515,
                    "canGo": false
                  },
                  {
                    "time": 530,
                    "canGo": false
                  },
                  {
                    "time": 545,
                    "canGo": false
                  },
                  {
                    "time": 600,
                    "canGo": true
                  },
                  {
                    "time": 615,
                    "canGo": true
                  },
                  {
                    "time": 630,
                    "canGo": true
                  },
                  {
                    "time": 645,
                    "canGo": false
                  },
                  {
                    "time": 700,
                    "canGo": false
                  },
                  {
                    "time": 715,
                    "canGo": false
                  },
                  {
                    "time": 730,
                    "canGo": false
                  },
                  {
                    "time": 745,
                    "canGo": false
                  },
                  {
                    "time": 800,
                    "canGo": false
                  },
                  {
                    "time": 815,
                    "canGo": false
                  },
                  {
                    "time": 830,
                    "canGo": false
                  },
                  {
                    "time": 845,
                    "canGo": false
                  }
                ]
              }
            ]
          }
        ]    
      }
    ]
  }
};
