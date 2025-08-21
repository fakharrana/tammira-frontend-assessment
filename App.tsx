import React from 'react';
import { Provider } from 'react-redux';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { store } from './src/store';
import BlogList from './src/screens/blog-list';
import ErrorBoundary from './src/components/error-boundary';

const App = () => (
  <ErrorBoundary>
    <Provider store={store}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
          <StatusBar barStyle="dark-content" backgroundColor="#fff" />
          <BlogList />
        </SafeAreaView>
      </SafeAreaProvider>
    </Provider>
  </ErrorBoundary>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

export default App;
