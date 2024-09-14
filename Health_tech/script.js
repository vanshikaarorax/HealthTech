document.addEventListener('DOMContentLoaded', async () => {
    const video = document.getElementById('webcam');
    const objectInfoElement = document.getElementById('objectInfo');
    const startDetectionButton = document.getElementById('startDetection');
    const stopDetectionButton = document.getElementById('stopDetection');

    const ws = new WebSocket('ws://localhost:3000');
    ws.onmessage = (event) => {
      // Handle messages from the server if needed
      console.log(event.data);
    };

    await tf.setBackend('webgl');
    const model = await cocoSsd.load();
    let isDetecting = false;
    let speaking = false; // Track if currently speaking

    const speak = (text) => {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    };

    startDetectionButton.addEventListener('click', async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        video.addEventListener('loadeddata', () => {
          video.play();

          const canvas = document.createElement('canvas');
          document.getElementById('webcamContainer').appendChild(canvas);
          const context = canvas.getContext('2d');
          canvas.width = video.width;
          canvas.height = video.height;

          const detectFrame = async () => {
            context.drawImage(video, 0, 0, video.width, video.height);
            const image = tf.browser.fromPixels(video);
            const predictions = await model.detect(image);

            // Process the predictions as needed
            console.log(predictions);

            // Draw rectangles around detected objects and update objectInfo
            objectInfoElement.innerHTML = ''; // Clear previous info
            predictions.forEach(prediction => {
              context.beginPath();
              context.rect(
                prediction.bbox[0],
                prediction.bbox[1],
                prediction.bbox[2],
                prediction.bbox[3]
              );
              context.lineWidth = 2;
              context.strokeStyle = 'red';
              context.fillStyle = 'red';
              context.stroke();
              context.fillText(
                `${prediction.class} (${Math.round(prediction.score * 100)}%)`,
                prediction.bbox[0],
                prediction.bbox[1] > 10 ? prediction.bbox[1] - 5 : 10
              );

              // Display detected object info in the div
              const infoDiv = document.createElement('div');
              infoDiv.textContent = `Detected: ${prediction.class}`;
              objectInfoElement.appendChild(infoDiv);

              // Speak the detected object if not already speaking
              if (!speaking) {
                speaking = true;
                speak(`Detected: ${prediction.class}`);
                setTimeout(() => {
                  speaking = false;
                }, 2000); // Allow time for speaking before resetting
              }
            });

            if (isDetecting) {
              requestAnimationFrame(detectFrame);
            }
          };

          // Start detection when the button is clicked
          isDetecting = true;
          detectFrame();
        });
      } catch (error) {
        console.error('Error accessing webcam:', error);
      }
    });

    stopDetectionButton.addEventListener('click', () => {
      // Stop detection, close webcam, and clear object info when the button is clicked
      isDetecting = false;
      video.srcObject.getTracks().forEach(track => track.stop());
      objectInfoElement.innerHTML = ''; // Clear object info
      speaking = false; // Stop speaking
    });
  });