import { useNavigation } from '@react-navigation/native';

import { IconButton } from '@suite-native/atoms';

export const GoBackIcon = () => {
    const navigation = useNavigation();

    return (
        <IconButton
            iconName="chevronLeft"
            size="medium"
            colorScheme="tertiaryElevation0"
            onPress={() => navigation.goBack()}
        />
    );
};
