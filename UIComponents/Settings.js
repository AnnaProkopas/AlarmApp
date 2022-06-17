function Settings(props) {
    return (
        <View>
            <Button
                title='Submit'
                onPress={() => {
                    props.navigation.navigate('Home', ({ time: textTime }));
                }}
            />
            <Button
                title='Cancel'
                onPress={() => {
                    props.navigation.goBack();
                }}
            />
        </View>
        );
}

export { Settings };