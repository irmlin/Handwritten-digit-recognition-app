This application is based on the information provided in the online book "Neural Networks and Deep Learning" by Michael Nielsen (see link in references). The book provides excellent in-depth explanations and mathematical proofs for beginners in machine learning. The foundation of the book is a neural network for recognizing handwritten digits, for which data is taken from the MNIST database (see link in references).

# THE DATA
MNIST database provides 70000 images of handwritten digits. To train the neural network, 50000 are used, while the remaining data is used for testing and validating (a holdout set), 10000 for each. Each picture is 22x22 in pixels.

# THE NEURAL NETWORK
The network contains 3 layers. The input layer has 784 neurons, one for each pixel of the 22x22 sized images. The hidden layer uses 30 neurons, the output layer - 10 neurons, one for each digit. The larger the output activation is of the output neuron, the more confident the model thinks that, for instance, the digit is 3 (in such case, the output of the 3rd neuron in the output layer will be the nearest to 1). 

# THE ALGORITHM
The neural network is trained using a stochastic gradient descent algorithm. The training data is split into mini batches, for each mini batch gradient is computed using a backpropagation algorithm. Weights and biases are updated using the gradient accordingly to the formulas, given in the book. The neural network itself uses sigmoid neurons, so their activation function is a sigmoid function, which means neurons' outputs are within range (0; 1). For the cost function, cross-entropy is used, because it does not have the slowdown issue, like quadratic cost function has. Partial derivatives of quadratic cost function with respect to weights and biases have the derivative of the sigmoid function, and as we know, when the sigmoid function obtains values close to 0 or 1, its derivative gets very close to 0, which means that the gradient will be small and the learning will be slowed down. Another thing to mention, is that regularization optimization is used for the cost function. It gives a penalty for large weights, so we are trying to find smaller weights. Smaller weights are less sensitive to noises/changes in the data (a small change in the inputs should not have a big effect on the outputs; small weights help to achieve just that). Regularization reduces overfiting, because with the method just mentioned we generalize the network - it learns to pick up on general patterns of data. The algorithm achieves rougly 97% accuracy on training data and 96% accuracy on test data.

# THE APPLICATION
This is a REST API application with "React" for the frontend and python's "Django REST" framework for the backend. The client-side has a single page, where the user can draw a digit (mimicking handwritten digits) and use the trained neural network model to guess the digit. The user can see the output of the the network too - the closer the output neurons are to 1, the more assured the network is about its prediction. The outputs are converted to percentages for better user experience (although it is not techinally probability, since the output layer is not a softmax layer). The user is then offered to assess the model's guess - if the prediction was correct, then the drawn digit and its label are immediately sent to the database - the training set increases. If model's guess was wrong, then user can correct the label and then send it to the server. For now, the model retrains when 10 new verified images are collected. The server-side has one endpoint 'api/digits', where request are sent. The image to the server is sent as a byte array, the image is then prccessed in the server and converted to a grayscale array of values from 0 to 1, where 0 is black and 1 is white. Such conversion is applied, because it is suitable for inputs to the neural network. The images and the model's current state are stored in a sqlite3 database, provided by Django framework. The database has two tables:
1. Digit. Columns:
  - picture - 784-dimensional numpy array
  - label - integer representation of the picture (digit itself)
  - is_training_input - a boolean value assigning the digit to either training or test/validation set
2. ModelState. Columns:
  - biases - a string representing network's biases
  - weights - a string representing network's weights
  - train_accuracy - a float value for model's accuracy on training set
  - test_accuracy - a float value for model's accuracy on test set
  - is_training - a boolean value for keeping track when the network is training

![paveikslas](https://user-images.githubusercontent.com/89913764/192628279-41873706-87fd-478c-a70d-e38f5e0dd8e1.png)

![paveikslas](https://user-images.githubusercontent.com/89913764/192628332-bfc99dc3-a6b5-49f7-84aa-1fdb26cbe00f.png)

![paveikslas](https://user-images.githubusercontent.com/89913764/192628369-31851a4e-3dee-4f03-b131-517c22539602.png)

![paveikslas](https://user-images.githubusercontent.com/89913764/192628785-4f33bb45-9259-4667-98df-1a775be2c5a2.png)

![paveikslas](https://user-images.githubusercontent.com/89913764/192628800-e16a1354-bde2-4016-8588-8c2f484bcd81.png)


# REFERENCES:
  1. "Neural Networks and Deep Learning" by Michael Nielsen: http://neuralnetworksanddeeplearning.com/index.html
  2. MNIST database: http://yann.lecun.com/exdb/mnist/ 
