# Ombori React Native Code Test

1. For run flow, call "yarn flow".
2. Current React doesn't support hooks, so I can't use them

What the test app should do:

* Display a custom loading component for 3 seconds that uses the [React Native Animated library](https://facebook.github.io/react-native/docs/animated.html)
* Fetch user data from https://reqres.in/
* Display those users in a scrollable view that lazy loads more users when you've reached the bottom of the list, if there are no more users to load it should indicate that there are no more users.
